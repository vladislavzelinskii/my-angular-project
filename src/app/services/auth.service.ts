import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import auth = firebase.auth;
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { SignUpLogOutButtonService } from './sign-up-log-out-button.service';
import { from } from 'rxjs';
import { CounterCartService } from './counter-cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn!: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private signUpLogOutButtonService: SignUpLogOutButtonService,
    private counterCartService: CounterCartService,
  ) { }

  public signin(email: string, password: string): any {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      tap((res: any) => {
        this.updateUserData(res.user);
      }),
      catchError((err: any): any => {
        if (err.code === "auth/wrong-password") {
          alert("Email or password wrong");
        } else if (err.code === "auth/user-not-found") {
          alert("There is no user with such email");
        }
      })
    )
  }

  public signup(email: string, password: string): any {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      tap((res: any) => {
        this.updateUserData(res.user);
      }),
      catchError((err: any): any => {
        if (err.code === "auth/email-already-in-use") {
          alert("Email already in use");
        }
      })
    )
  }

  logout() {
    this.afAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }

  public googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      tap((userCred: auth.UserCredential) => {
        this.updateUserData(userCred.user)
      })
    )
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

        if (flagForCurrentCart) {
          localStorage.setItem('cart', idOfCart);
          this.counterCartService.checkValue();
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
              }, { merge: true })
              this.counterCartService.checkValue();
            });
        }

      })

    ).subscribe();

    return userRef.set(data, { merge: true })
  }

}