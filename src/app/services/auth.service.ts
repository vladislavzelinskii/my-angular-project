import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'; 
import 'firebase/auth'; 

import auth = firebase.auth;
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {}

  async signin(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password)
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
      console.log(res.user?.uid);
      
      // пройти по коллекции cart, найти документ с айдишником res.user.uid, засетать cartId в localStorage
    })
  }
  async signup(email: string, password: string) {
    await this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      // this.isLoggedIn = true;
      // localStorage.setItem('user', JSON.stringify(res.user));
      this.updateUserData(res.user);
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

  // async signOut() {
  //   await this.afAuth.signOut();
  //   return this.router.navigate(['/']);
  // }

  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user?.uid}`);

    const data = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoUrl: user?.photoURL,
    };

    this.isLoggedIn = true;
    localStorage.setItem('user', JSON.stringify(data));

    this.afs.collection('cart').add({
      totalPrice: 0,
      userId: user?.uid,
      productsInCart: [],
    })
    .then((docRef) => {
      localStorage.setItem('cart', docRef.id);
      this.afs.collection('cart').doc(localStorage.cart).set({
        id: localStorage.cart,
      }, { merge: true } )
    });

    return userRef.set(data, { merge: true })
  }

}


