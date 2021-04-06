import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-cards',
  templateUrl: './bank-cards.component.html',
  styleUrls: ['./bank-cards.component.scss']
})
export class BankCardsComponent implements OnInit {

  cardForm = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
    cardMonth: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    cardYear: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    cardCVV: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
  });

  get cardNumber() {
    return this.cardForm.get('cardNumber');
  }
  get cardMonth() {
    return this.cardForm.get('cardMonth');
  }
  get cardYear() {
    return this.cardForm.get('cardYear');
  }
  get cardCVV() {
    return this.cardForm.get('cardCVV');
  }


  constructor(
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.cardForm.value);
  }

  goBack() {
    this.location.back();
  }

}
