import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { BankCard } from 'src/app/models/bankCard';
import { cardCVVValidator, cardExpiresValidator, cardHolderValidator, cardNumberValidator, formValidator, cardRadioButtonValidator } from 'src/app/validators/cardValidators.directive';

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
  flagSaveCard: boolean = false;

  currentBankCard!: BankCard;
  
  date: any;
  currentMonth: any;
  currentYear: any;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private datepipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      card: [ , [cardRadioButtonValidator()]],
    });

    this.date = new Date();
    this.currentMonth = this.datepipe.transform(this.date, 'MM');
    this.currentYear = this.datepipe.transform(this.date, 'yy');

    this.currentMonth = +this.currentMonth;
    this.currentYear = +this.currentYear;

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

    this.setValueToChangeCard();

  }

  setValueToChangeCard() {
    this.firestore.collection('cart').valueChanges().pipe(
      map((res: any) => {
        res.map((element: any) => {
          if (element.id === localStorage.cart) {
            if (element.currentCard) {
              this.currentBankCard = element.currentCard;
              if (element.currentCard.id !== 9999 && this.cardForm.controls['card']) {
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
    this.cardForm = this.fb.group({
      cardNumber: [ , [cardNumberValidator()]],
      cardHolder: [ , [cardHolderValidator()]],
      cardExpires: [ , [cardExpiresValidator(this.currentMonth, this.currentYear)]],
      cardCVV: [ , [cardCVVValidator()]],
      saveCard: [],
      cardName: [],
    }, { validator: formValidator("cardName", "saveCard") });
  }

  cancelAddNewCart(event: any) {
    event.preventDefault();
    this.flagNewCard = !this.flagNewCard;
    this.cardForm = this.fb.group({
      card: [ , [cardRadioButtonValidator()]],
    });
    this.setValueToChangeCard();
  }

  submit() {
    let formValue = this.cardForm.value;

    if (formValue.cardNumber && formValue.cardExpires && formValue.cardHolder) {

      let cardNumber = formValue.cardNumber;
      let cardMonth = formValue.cardExpires.substring(0, 2);
      let cardYear = formValue.cardExpires.substring(formValue.cardExpires.length - 2);
      let cardHolder = formValue.cardHolder;
      let saveNewCard = formValue.saveCard;
      let cardCVV = formValue.cardCVV;
      let cardName = formValue.cardName;

      if (saveNewCard) {
        
        this.firestore.collection('users').valueChanges().pipe(
          first(), map((details: any) => {
            details.map((element: any) => {
              if (element.uid === JSON.parse(localStorage.user).uid) {
                let arrayOfBankCards = element.bankCards || [];

                let lastId = 1;
                if (arrayOfBankCards.length > 0) {
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
                  cardName: cardName,
                  cardCVV: cardCVV,
                });
                this.firestore.collection('users').doc(JSON.parse(localStorage.user).uid).update({
                  bankCards: arrayOfBankCards,
                });
                this.firestore.collection('cart').doc(localStorage.cart).update({
                  currentCard: {
                    image: 'no image',
                    id: lastId,
                    cardNumber: cardNumber,
                    cardMonth: cardMonth,
                    cardYear: cardYear,
                    cardHolder: cardHolder,
                    cardName: cardName || null,
                    cardCVV: cardCVV,
                  }
                });
              }
              return element;
            })
            return details;
          })
        ).subscribe();

      } else {
        this.firestore.collection('cart').doc(localStorage.cart).update({
          currentCard: {
            image: 'no image',
            id: 9999,
            cardNumber: cardNumber,
            cardMonth: cardMonth,
            cardYear: cardYear,
            cardHolder: cardHolder,
            cardName: cardName || null,
            cardCVV: cardCVV,
          }
        });
      }
      
    } else {
      let card = this.bankCards.filter((element: any) => element.id === this.cardForm.value.card)[0];
      this.firestore.collection('cart').doc(localStorage.cart).update({
        currentCard: card
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

  cardNumberFormat(event: any) {
    let value = event.target.value;
    value = value.replace(new RegExp(' ', 'g'), '');
    if (value.length > 4) {
      value = value.substr(0, 4) + ' ' + value.substr(4, value.length);
    }
    if (value.length > 9) {
      value = value.substr(0, 9) + ' ' + value.substr(9, value.length);
    }
    if (value.length > 14) {
      value = value.substr(0, 14) + ' ' + value.substr(14, value.length);
    }
    if (value.length > 19) {
      value = value.substring(0, 19);
    }
    event.target.value = value;
  }

  cardExpiresFormat(event: any) {
    let value = event.target.value;
    value = value.replace(new RegExp('/', 'g'), '');
    if (value.length > 2) {
      value = value.substr(0, 2) + '/' + value.substr(2, value.length);
    }
    if (value.length > 5) {
      value = value.substring(0, 5);
    }
    event.target.value = value;
  }

  closeForm() {
    this.onChanged.emit();
  }

  get card() {
    return this.cardForm.get('card');
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
  get cardName() {
    return this.cardForm.get('cardName');
  }

}
