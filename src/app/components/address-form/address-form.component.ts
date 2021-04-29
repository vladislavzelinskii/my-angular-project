import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

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
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    house: new FormControl('', Validators.required),
    flat: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    index: new FormControl('', Validators.required),
  });

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.firestore.collection('users').valueChanges().pipe(
      map((details: any) => {
        details.map((element: any) => {
          if (element.uid === JSON.parse(localStorage.user).uid) {
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
    this.onChanged.emit();
  }

  closeForm() {
    this.onChanged.emit();
  }

}
