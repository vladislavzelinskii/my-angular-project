import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  item?: Observable<User>;

  userId: string = '';
  userEmail: string = '';

  flagForEditAddress!: boolean;
  flagForEditCard!: boolean;
  flagContent: string = 'shipping';

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {

    if (localStorage.user) {
      this.userId = JSON.parse(localStorage.user).uid;
      this.userEmail = JSON.parse(localStorage.user).email;
    }

    this.item = this.firestore.collection('users', ref => {
      return ref.where('uid', '==', this.userId)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      })
    );
  }

  changeContent(value: string) {
    this.flagContent = value;
  }

  editAddress() {
    this.flagForEditAddress = true;
  }
  closeAddressFromChildComponent(){
    this.flagForEditAddress = false;
  }

  // addCard() {
  //   this.flagForEditCard = true;
  // }
  // closeCardFromChildComponent(){
  //   this.flagForEditCard = false;
  // }

  removeCard(cardId: number) {
    this.firestore.collection('users').valueChanges().pipe(
      first(), map((details: any) => {
        details.map((element: any) => {
          if (element.uid === JSON.parse(localStorage.user).uid) {
            let arrayOfBankCards = element.bankCards || [];
            console.log(arrayOfBankCards);
            arrayOfBankCards = arrayOfBankCards.filter((element: any) => element.id !== cardId);
            this.firestore.collection('users').doc(JSON.parse(localStorage.user).uid).update({
              bankCards: arrayOfBankCards,
            });
          }
          return element;
        })
        return details;
      })
    ).subscribe();
  }

}
