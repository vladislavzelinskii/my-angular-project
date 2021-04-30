import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

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
    public authService: AuthService,
  ) {}

  ngOnInit(): void {

    if (localStorage.cart) {

      this.isSignedIn = true;

      this.firebase.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        map((res: any) => {
            if (res.productsInCart) {
              this.itemsLength = res.productsInCart.length;
            }
          }
        )
      ).subscribe();
    } else {
      this.isSignedIn = false;
    }

  }

  logout() {
    this.authService.logout();
    this.isSignedIn = false;
    window.location.reload();
  }

}
