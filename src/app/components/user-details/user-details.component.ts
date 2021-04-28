import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  item?: Observable<User>;

  userId = JSON.parse(localStorage.user).uid;
  userEmail = JSON.parse(localStorage.user).email;

  flagForEditAddress: boolean = false;
  flagContent: string = 'shipping';

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
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

  removeCard(cardId: number) {
    alert('remove card ' + cardId);
  }
  addCard() {
    alert('add card');
  }

  

}
