import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CounterCartService } from 'src/app/services/counter-cart.service';
import { SignUpLogOutButtonService } from 'src/app/services/sign-up-log-out-button.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  itemsLength: number = 0;
  isSignedIn!: boolean;

  showLoginPopup!: boolean;

  constructor(
    private firebase: AngularFirestore,
    private authService: AuthService,
    private signUpLogOutButtonService: SignUpLogOutButtonService,
    private counterCartService: CounterCartService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.signUpLogOutButtonService.subject.subscribe((nextValue: any) => {
      nextValue ? this.isSignedIn = true : this.isSignedIn = false
    });

    this.counterCartService.subject.subscribe((nextValue: any) => {
      this.itemsLength = nextValue;
    });


    // if (localStorage.cart) {
    //   this.firebase.collection('cart').doc(localStorage.cart).valueChanges()
    //   .pipe(
    //     map((res: any) => {
    //         if (res.productsInCart) {
    //           this.itemsLength = res.productsInCart.length;
    //         }
    //       }
    //     )
    //   ).subscribe();
    // }

  }

  toCart() {
    if (localStorage.cart) {
      this.router.navigateByUrl('/cart');
    } else {
      this.showLogin();
    }
  }

  toUserDetails() {
    if (localStorage.user) {
      this.router.navigateByUrl('/userDetails');
    } else {
      this.showLogin();
    }
  }

  toAuth() {
    this.router.navigateByUrl('/auth');
  }

  logout() {
    this.authService.logout();
    this.isSignedIn = false;
    window.location.reload();
  }

  showLogin() {
    this.showLoginPopup = true;
  }
  closeLogin() {
    this.showLoginPopup = false;
  }
  closeLoginFromChildComponent() {
    this.showLoginPopup = false;
  }

}