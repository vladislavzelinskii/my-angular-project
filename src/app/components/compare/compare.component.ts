import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { CompareCounterService } from 'src/app/services/compare-counter.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  products: Array<Product> = [];

  arrayId: Array<number> = [];

  arrayIdOfProductsToCompare: Array<number> = [];

  arrayHeadlines: Array<any> = [];
  arrayProducts: Array<any> = [];

  specsNotToCompare: Array<string> = ['processorModel', 'printTechnology', 'paperSize', 'storageType', 'casingMaterial'];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private counterService: CompareCounterService,
  ) {}

  ngOnInit(): void {
    this.arrayComparison();
  }

  arrayComparison() {
    if (localStorage.compare) {
      this.arrayId = JSON.parse(localStorage.compare).items;
    }

    this.arrayIdOfProductsToCompare = [];
    this.products = [];
    this.arrayHeadlines = [];
    this.arrayProducts = [];

    this.arrayId.map((element: any) => {
      this.arrayIdOfProductsToCompare.push(+element);
    })

    this.firestore.collection('products').valueChanges().pipe(
      map((products: any): any => {
        products.map((element: any) => {
          if (this.arrayIdOfProductsToCompare.includes(element.id)) {
            this.products.push(element);

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

        this.arrayProducts.map((product: any) => {
          product.map((element: any, index: any) => {
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
    localStorage.removeItem('compare');
    this.counterService.subject.next(0);
    this.router.navigateByUrl('/products');
  }

  deleteProductFromCompare(productId: number) {
    let compareValue: { category: string, items: Array<number> } = {
      category: '',
      items: []
    };
    compareValue.category = JSON.parse(localStorage.compare).category;
    compareValue.items = JSON.parse(localStorage.compare).items.filter((id: number) => id !== productId);
    localStorage.setItem('compare', JSON.stringify(compareValue));
    this.counterService.subject.next(JSON.parse(localStorage.compare).items.length);

    this.arrayComparison();
  }

}
