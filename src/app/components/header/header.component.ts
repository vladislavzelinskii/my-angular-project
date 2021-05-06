import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SignUpLogOutButtonService } from 'src/app/services/sign-up-log-out-button.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  itemsLength: number = 0;
  isSignedIn: boolean = false;

  constructor(
    private firebase: AngularFirestore,
    private authService: AuthService,
    private signUpLogOutButtonService: SignUpLogOutButtonService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.signUpLogOutButtonService.subject.subscribe((nextValue: any) => {
      if (nextValue) {
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
    });


    if (localStorage.cart) {
      this.firebase.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        map((res: any) => {
            if (res.productsInCart) {
              this.itemsLength = res.productsInCart.length;
            }
          }
        )
      ).subscribe();
    }

  }

  toCart() {
    if (localStorage.cart) {
      this.router.navigateByUrl('/cart');
    } else {
      alert('Please sign up');
    }
  }

  toUserDetails() {
    if (localStorage.user) {
      this.router.navigateByUrl('/userDetails');
    } else {
      alert('Please sign up');
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

}
