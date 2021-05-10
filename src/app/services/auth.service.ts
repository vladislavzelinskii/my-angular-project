import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'; 
import 'firebase/auth'; 

import auth = firebase.auth;
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { SignUpLogOutButtonService } from './sign-up-log-out-button.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn!: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private signUpLogOutButtonService: SignUpLogOutButtonService,
  ) {}

  async signin(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password)
    .then(res => {
      this.updateUserData(res.user);
    }).catch((err) => {
      if (err.code === "auth/wrong-password") {
        alert("Email or password wrong");
      }
    })
  }
  async signup(email: string, password: string) {
    await this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      this.updateUserData(res.user);
    }).catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use");
      }
    })
  }
  logout() {
    this.afAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user?.uid}`);

    const data = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoUrl: user?.photoURL,
    };

    this.isLoggedIn = true;
    localStorage.setItem('user', JSON.stringify(data));

    this.signUpLogOutButtonService.subject.next(true);



    this.firestore.collection('cart').valueChanges().pipe(
      take(1),
      map((documents: any) => {

        let flagForCurrentCart: boolean = false;
        let idOfCart: string = '';

        documents.map((element: any) => {
          if (element.userId === user?.uid) {
            flagForCurrentCart = true;
            idOfCart = element.id;
          }
        })

        // if (flagForCurrentCart) {
        //   localStorage.setItem('cart', idOfCart);
        //   return '';
        // }
        // return idOfCart;
        

        if (flagForCurrentCart) {
          localStorage.setItem('cart', idOfCart);
        } else {
          this.firestore.collection('cart').add({
            totalPrice: 0,
            userId: user?.uid,
            productsInCart: [],
          })
          .then((docRef) => {
            localStorage.setItem('cart', docRef.id);
            this.firestore.collection('cart').doc(localStorage.cart).set({
              id: localStorage.cart,
            }, { merge: true } )
          });
        }

        



      // }),
      // filter((id: string) => !!id),
      // switchMap((idOfCart: string) => {
      //   return this.firestore.collection('cart').add({
      //     totalPrice: 0,
      //     userId: user?.uid,
      //     productsInCart: [],
      //   })
      // }),
      // switchMap((object: any) => {
      //   localStorage.setItem('cart', object.id)
      //   return this.firestore.collection('cart').doc(localStorage.cart).set({
      //           id: localStorage.cart,
      //         }, { merge: true } )
      })


    ).subscribe();

    

    return userRef.set(data, { merge: true })
  }

}


