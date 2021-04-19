import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-bank-card-form',
  templateUrl: './bank-card-form.component.html',
  styleUrls: ['./bank-card-form.component.scss']
})
export class BankCardFormComponent implements OnInit {

  @Output() onChanged = new EventEmitter<boolean>();

  arr: any = [];

  cardForm: any = FormGroup;

  flagNewCard: boolean = false;

  currentBankCard: any;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      card: [],
      cardNumber: [],
      cardHolder: [],
      cardExpires: [],
      cardCVV: [],
      saveCard: [],
      cardName: [],
    });


    this.firestore.collection('usersDetails').valueChanges().pipe(
      map((details: any) => {
        details.map((element: any) => {
          if (element.id === 0) {
            this.arr = element.bankCards;
          }
          return element;
        })
        return details;
      })
    ).subscribe();

    this.firestore.collection('cart').valueChanges().pipe(
      map((res: any) => {
        res.map((element: any) => {
          if (element.id === 0) {
            this.currentBankCard = element.currentCard;
            if (element.currentCard.id !== 9999) {
              this.cardForm.controls['card'].setValue(element.currentCard.id);
            }
          }
        })
      })
    ).subscribe();

  }

  addNewCard(event: any) {
    event.preventDefault();
    this.flagNewCard = !this.flagNewCard;
  
  }

  onSubmit() {
    let formValue = this.cardForm.value;

    if (formValue.cardNumber && formValue.cardExpires && formValue.cardHolder) {

      let cardNumber = formValue.cardNumber;
      let cardMonth = formValue.cardExpires.substring(0, 2);
      let cardYear = formValue.cardExpires.substring(formValue.cardExpires.length - 2);
      let cardHolder = formValue.cardHolder;
      let saveNewCard = formValue.saveCard;

      if (saveNewCard) {

        this.firestore.collection('usersDetails').valueChanges().pipe(
          first(), map((details: any) => {
            details.map((element: any) => {
              if (element.id === 0) {
                let arrayOfBankCards = element.bankCards || [];
                arrayOfBankCards.push({
                  image: 'no image',
                  id: arrayOfBankCards.length,
                  cardNumber: cardNumber,
                  cardMonth: cardMonth,
                  cardYear: cardYear,
                  cardHolder: cardHolder,
                  cardName: formValue.cardName,
                });
                this.firestore.collection('usersDetails').doc('0').update({
                  bankCards: arrayOfBankCards,
                });
              }
              return element;
            })
            return details;
          })
        ).subscribe();

      }

      this.firestore.collection('cart').doc('0').update({
        currentCard: {
          image: 'no image',
          id: 9999,
          cardNumber: cardNumber,
          cardMonth: cardMonth,
          cardYear: cardYear,
          cardHolder: cardHolder,
          cardName: formValue.cardName || null,
        }
      });
    } else {
      this.firestore.collection('cart').doc('0').update({
        currentCard: this.arr[this.cardForm.value.card]
      });
    }
    
    this.onChanged.emit();

  }

  // closeForm() {
  //   this.onChanged.emit();
  // }

}
