import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { inputLengthValidator } from 'src/app/validators/address-validators';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Output() onChanged = new EventEmitter<boolean>();

  name: any = '';
  phone: any = '';
  street: any = '';
  house: any = '';
  flat: any = '';
  country: any = '';
  city: any = '';
  index: any = '';

  addressForm = new FormGroup({
    name: new FormControl('', [Validators.required, inputLengthValidator(40)]),
    phone: new FormControl('', Validators.required),
    street: new FormControl('', [Validators.required, inputLengthValidator(40)]),
    house: new FormControl('', [Validators.required, inputLengthValidator(3)]),
    flat: new FormControl('', [Validators.required, inputLengthValidator(4)]),
    country: new FormControl('', [Validators.required, inputLengthValidator(40)]),
    city: new FormControl('', [Validators.required, inputLengthValidator(40)]),
    index: new FormControl('', [Validators.required, inputLengthValidator(6)]),
  });

  constructor(
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.firestore.collection('users').valueChanges().pipe(
      map((details: any) => {
        details.map((element: any) => {
          if (localStorage.user && element.uid === JSON.parse(localStorage.user).uid) {
            if (element.displayName) this.name = element.displayName;
            if (element.phone) this.phone = element.phone;
            if (element.address) {
              if (element.address.street) this.street = element.address.street;
              if (element.address.house) this.house = element.address.house;
              if (element.address.flat) this.flat = element.address.flat;
              if (element.address.flat) this.country = element.address.country;
              if (element.address.flat) this.city = element.address.city;
              if (element.address.flat) this.index = element.address.index;
            }
          }
        })
      })
    ).subscribe(x => {
      this.addressForm.setValue({
        name: this.name,
        phone: this.phone,
        street: this.street,
        house: this.house,
        flat: this.flat,
        country: this.country,
        city: this.city,
        index: this.index,
      })
    });
  }

  inputOnlyDigits(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  phoneFormat(event: any) {
    let value = event.target.value;
    value = value.replace(/\D+/g,"");

    if (value.length > 0) {
      value = '+' + value.substr(0, value.length);
    }
    if (value.length > 4) {
      value = value.substr(0, 4) + '(' + value.substr(4, value.length);
    }
    if (value.length > 7) {
      value = value.substr(0, 7) + ') ' + value.substr(7, value.length);
    }
    if (value.length > 12) {
      value = value.substr(0, 12) + '-' + value.substr(12, value.length);
    }
    if (value.length > 15) {
      value = value.substr(0, 15) + '-' + value.substr(15, value.length);
    }
    if (value.length > 18) {
      value = value.substr(0, 18);
    }
    
    event.target.value = value;
  }

  onSubmit() {
    this.firestore.collection('users').doc(JSON.parse(localStorage.user).uid).update({
      displayName: this.addressForm.value.name, 
      phone: this.addressForm.value.phone, 
      address: {
        street: this.addressForm.value.street,
        house: this.addressForm.value.house,
        flat: this.addressForm.value.flat,
        country: this.addressForm.value.country,
        city: this.addressForm.value.city,
        index: this.addressForm.value.index,
      },
    });

    let user = JSON.parse(localStorage.user);
    user.displayName = this.addressForm.value.name;
    localStorage.user = JSON.stringify(user);

    this.onChanged.emit();
  }

  closeForm() {
    this.onChanged.emit();
  }

  get nameInput() {
    return this.addressForm.get('name');
  }
  get streetInput() {
    return this.addressForm.get('street');
  }
  get houseInput() {
    return this.addressForm.get('house');
  }
  get flatInput() {
    return this.addressForm.get('flat');
  }
  get countryInput() {
    return this.addressForm.get('country');
  }
  get cityInput() {
    return this.addressForm.get('city');
  }
  get indexInput() {
    return this.addressForm.get('index');
  }

}
