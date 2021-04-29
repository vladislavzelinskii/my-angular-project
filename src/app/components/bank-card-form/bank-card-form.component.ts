import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { BankCard } from 'src/app/models/bankCard';
import { cardCVVValidator, cardExpiresValidator, cardHolderValidator, cardNumberValidator} from 'src/app/shared/cardValidators.directive';

@Component({
  selector: 'app-bank-card-form',
  templateUrl: './bank-card-form.component.html',
  styleUrls: ['./bank-card-form.component.scss']
})
export class BankCardFormComponent implements OnInit {

  @Output() onChanged = new EventEmitter<boolean>();

  bankCards: any = [];

  cardForm!: FormGroup;

  flagNewCard: boolean = false;

  currentBankCard!: BankCard;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      card: [],
      cardNumber: [ , [cardNumberValidator()]],
      cardHolder: [ , [cardHolderValidator()]],
      cardExpires: [ , [cardExpiresValidator()]],
      cardCVV: [ , [cardCVVValidator()]],
      saveCard: [],
      cardName: [],
    });


    this.firestore.collection('users').valueChanges().pipe(
      map((details: any) => {
        details.map((element: any) => {
          if (localStorage.user) {
            if (element.uid === JSON.parse(localStorage.user).uid) {
              this.bankCards = element.bankCards;
            }
          }
          return element;
        })
        return details;
      })
    ).subscribe();

    this.firestore.collection('cart').valueChanges().pipe(
      map((res: any) => {
        res.map((element: any) => {
          if (element.id === localStorage.cart) {
            if (element.currentCard) {
              this.currentBankCard = element.currentCard;
              if (element.currentCard.id !== 9999) {
                this.cardForm.controls['card'].setValue(element.currentCard.id);
              }
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

  changeCard() {
    let card = this.bankCards.filter((element: any) => element.id === this.cardForm.value.card)[0];
    this.firestore.collection('cart').doc(localStorage.cart).update({
      currentCard: card
    });
    this.onChanged.emit();
  }

  addNewCardSubmit() {
    let formValue = this.cardForm.value;

    if (formValue.cardNumber && formValue.cardExpires && formValue.cardHolder) {

      let cardNumber = formValue.cardNumber;
      let cardMonth = formValue.cardExpires.substring(0, 2);
      let cardYear = formValue.cardExpires.substring(formValue.cardExpires.length - 2);
      let cardHolder = formValue.cardHolder;
      let saveNewCard = formValue.saveCard;

      if (saveNewCard) {

        this.firestore.collection('users').valueChanges().pipe(
          first(), map((details: any) => {
            details.map((element: any) => {
              if (element.uid === JSON.parse(localStorage.user).uid) {
                let arrayOfBankCards = element.bankCards || [];

                let lastId = 0;
                if (arrayOfBankCards > 0) {
                  lastId = arrayOfBankCards[arrayOfBankCards.length - 1].id;
                  lastId++;
                }
                  
                arrayOfBankCards.push({
                  image: 'no image',
                  id: lastId,
                  cardNumber: cardNumber,
                  cardMonth: cardMonth,
                  cardYear: cardYear,
                  cardHolder: cardHolder,
                  cardName: formValue.cardName,
                });
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

      this.firestore.collection('cart').doc(localStorage.cart).update({
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
    }
    
    this.onChanged.emit();

  }

  cardInputsOnlyDigits(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  cardNameFormat(event: any) {
    let value = event.target.value;
    value = value.replace(new RegExp(' ', 'g'), '');
    value = value.replace(/(\d{4})/g, '$1 ');
    if (value.length > 19) {
      value = value.substring(0, value.length - 1);
    }
    event.target.value = value;
  }

  cardExpiresFormat(event: any) {
    let value = event.target.value;
    value = value.replace(new RegExp('/', 'g'), '');
    value = value.replace(/(\d{2})/g, '$1/');
    if (value.length > 5) {
      value = value.substring(0, value.length - 1);
    }
    event.target.value = value;
  }

  get cardNumber() {
    return this.cardForm.get('cardNumber');
  }
  get cardHolder() {
    return this.cardForm.get('cardHolder');
  }
  get cardExpires() {
    return this.cardForm.get('cardExpires');
  }
  get cardCVV() {
    return this.cardForm.get('cardCVV');
  }

}
