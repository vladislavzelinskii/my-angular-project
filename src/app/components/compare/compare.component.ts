import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  products: any;

  product: Product | undefined;

  item$: any = [];
  // specs: any;

  arrayId: Array<string> = [];

  arrayIdOfProductsToCompare: Array<number> = [];

  arrayHeadlines: any = [];
  arrayProducts: any = [];

  specsNotToCompare: Array<string> = ['processorModel', 'printTechnology', 'paperSize', 'storageType', 'casingMaterial'];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.arrayId = Object.keys(localStorage);
    
    this.arrayId.map((element: any) => {
      this.arrayIdOfProductsToCompare.push(+element);
    })

    this.products = this.firestore.collection('products').valueChanges().pipe(
      map((products: any): any => {
        products.map((element: any) => {
          if (this.arrayIdOfProductsToCompare.includes(element.id)) {
            this.item$.push(element);
            
            Object.keys(element.specs).map((key: any) => {
              if (!this.arrayHeadlines.includes(key)) {
                this.arrayHeadlines.push(key);
              }
            });
          }
          return element;
        });

        products.map((element: any) => {
          if (this.arrayIdOfProductsToCompare.includes(element.id)) {
            let newProduct: any = [];
            this.arrayHeadlines.map((spec: string, index: any) => {
              if (this.specsNotToCompare.includes(spec)) {
                if (Object.keys(element.specs).includes(spec)) {
                  newProduct.push({
                    value: element.specs[spec],
                  });
                } else {
                  newProduct.push({
                    value: "-",
                  });
                }
              } else {
                if (Object.keys(element.specs).includes(spec)) {
                  newProduct.push({
                    value: element.specs[spec],
                    compare: false,
                  });
                } else {
                  newProduct.push({
                    value: "-",
                    compare: false,
                  });
                }
              }
            });
            this.arrayProducts.push(newProduct);
          }
          return element;
        });

        console.log(this.arrayProducts);

        this.arrayProducts.map((product: any) => {
          product.map((element: any, index: any) => {
            console.log(element.compare);
            
            if (element.compare === false) {
              let flag = true;
              let flag2 = true;
              for (let i = 0; i < this.arrayProducts.length; i++) {
                if (element.value < this.arrayProducts[i][index].value || element.value === '-') {
                  flag = false;
                }
                if (element.value !== this.arrayProducts[i][index].value) {
                  flag2 = false;
                }
              }
              if (flag && !flag2) {
                element.compare = true
              }
            }
          })
        })

        return products;
      })).subscribe();
  }

  clearComparison() {
    localStorage.clear();
    this.router.navigateByUrl('/products');
  }

  deleteProductFromCompare(productId: number) {
    localStorage.removeItem(productId.toString());
    window.location.reload();
  }

}
