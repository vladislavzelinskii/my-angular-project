import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  flagShowSearch!: boolean;
  products: Array<string> = [];
  productsList: Array<any> = [];
  currentValueSearch: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.firestore.collection('products').valueChanges().pipe(
      map((products: any): any => {
        products.map((element: any): any => {
          this.products.push(element);
        })
      })
    ).subscribe();
  }

  search($event: any) {
    this.flagShowSearch = true;

    this.productsList = [];
    this.currentValueSearch = $event.target.value.toLowerCase();

    if (this.currentValueSearch !== '') {
      this.products.map((element: any) => {
        if ((element.name.toLowerCase().indexOf(this.currentValueSearch)) >= 0) {
          this.productsList.push(element);
        }
      })
    }
  }

  goToProduct(productId: number) {
    this.flagShowSearch = false;
    this.router.navigate(['/product/' + productId]);
  }

  closeSearch() {
    this.flagShowSearch = false;
  }

}