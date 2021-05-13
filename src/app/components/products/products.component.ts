import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { CompareCounterService } from 'src/app/services/compare-counter.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  queryCategory: Params = {};

  flagForNoSelectedCategory!: boolean;

  allProducts: any = [];
  productsAfterFilter: any = [];
  currentProductsOnPage: any = [];
  currentPage: any = 1;
  itemsPerPage: any = 4;

  checkbox: any = true;

  arrayOfIdForCompare: any;

  showListOfSort!: boolean;

  currentOrder: string = 'Default';

  condition: { order?: string, desc?: any } = {};

  flagForLoader!: boolean;

  compareCounter!: number;
  flagForClearComparison!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private counterService: CompareCounterService,
  ) { }

  ngOnInit(): void {

    this.counterService.subject.subscribe((nextValue: any) => {
      this.compareCounter = nextValue;
    });

    this.activatedRoute.queryParams.subscribe(data => {
      this.queryCategory = data;

      this.productsAfterFilter = [];

      this.condition = {};

      if (data.order) {
        if (data.order.indexOf(':desc') === -1) {
          this.condition.order = data.order;
          this.currentOrder = 'cheap';
        } else {
          this.condition.order = data.order.replace(':desc', '');
          this.condition.desc = 'desc';
          this.currentOrder = 'expensive';
        }
      } else {
        this.currentOrder = 'Default';
      }

      this.callForProducts(this.condition.order, this.condition.desc);

    })

    this.arrayOfIdForCompare = Object.keys(localStorage);

  }

  callForProducts(order?: any, desc?: any) {
    if (order) {
      this.allProducts = this.firestore.collection('products', ref => ref.orderBy(order, desc));
    } else {
      this.allProducts = this.firestore.collection('products');
    }
    this.allProducts.valueChanges().pipe(
      tap((products: any) => {
        this.allProducts = products;
      })
    ).subscribe(() => this.productsMap());
  }

  productsMap() {

    this.productsAfterFilter = [];
    this.allProducts.map((element: any) => {
      if (this.queryCategory.category) {
        if (this.queryCategory.category.includes(element.category)) {
          this.productsAfterFilter.push(element)
        }
      } else {
        this.productsAfterFilter.push(element)
      }
    })

    this.currentProductsOnPage = [];
    this.currentPage = 1;

    let flag = 0;
    this.productsAfterFilter.map((element: any) => {
      if (flag < this.itemsPerPage) {
        this.currentProductsOnPage.push(element);
      }
      flag++;
      return element;
    })
    this.flagForLoader = true;
  }

  prevPage() {
    this.currentProductsOnPage = [];
    this.currentPage--;
    let flag = 0;
    this.productsAfterFilter.map((element: any) => {
      if ((flag >= this.itemsPerPage * (this.currentPage - 1)) && (flag < this.itemsPerPage * this.currentPage)) {
        this.currentProductsOnPage.push(element);
      }
      flag++;
      return element;
    })
  }

  nextPage() {
    this.currentProductsOnPage = [];
    this.currentPage++;
    let flag = 0;
    this.productsAfterFilter.map((element: any) => {
      if ((flag >= this.itemsPerPage * (this.currentPage - 1)) && (flag < this.itemsPerPage * this.currentPage)) {
        this.currentProductsOnPage.push(element);
      }
      flag++;
      return element;
    })
  }

  openList($event: any) {
    $event.stopPropagation();
    this.showListOfSort = !this.showListOfSort;
  }

  closeList() {
    if (this.showListOfSort) {
      this.showListOfSort = false;
    }
  }

  addToCompare(productId: number, category: string) {

    let compareValue: { category: string, items: Array<number> } = {
      category: '',
      items: []
    };

    if (!localStorage.compare) {
      let compareValue = {
        category: category,
        items: [productId],
      }
      localStorage.setItem('compare', JSON.stringify(compareValue));
      this.counterService.subject.next(JSON.parse(localStorage.compare).items.length);
    } else if (JSON.parse(localStorage.compare).category === category) {
      if (JSON.parse(localStorage.compare).items.includes(productId)) {
        compareValue.category = JSON.parse(localStorage.compare).category;
        compareValue.items = JSON.parse(localStorage.compare).items.filter((id: number) => id !== productId);
        if (!compareValue.items.length) {
          localStorage.removeItem('compare');
          this.counterService.subject.next(0);
        } else {
          localStorage.setItem('compare', JSON.stringify(compareValue));
          this.counterService.subject.next(JSON.parse(localStorage.compare).items.length);
        }
      } else {
        compareValue.category = JSON.parse(localStorage.compare).category;
        compareValue.items = JSON.parse(localStorage.compare).items;
        compareValue.items.push(productId);
        localStorage.setItem('compare', JSON.stringify(compareValue));
        this.counterService.subject.next(JSON.parse(localStorage.compare).items.length);
      }
    } else if (JSON.parse(localStorage.compare).category !== category) {
      alert("You cannot add products of different categories")
    }

  }

  changeUrlToOrderBy(value: string, reverse?: boolean) {
    if (value === 'id') {
      this.router.navigate([], {
        queryParams: {
          'order': null
        },
        queryParamsHandling: 'merge'
      });
    } else if (reverse) {
      this.router.navigate(['/products'], { queryParams: { order: value + ":desc" }, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate(['/products'], { queryParams: { order: value }, queryParamsHandling: 'merge' });
    }
  }

  goToCompare() {
    this.router.navigateByUrl('/compare');
  }

  clearCompare() {
    if (this.flagForClearComparison) {
      localStorage.removeItem('compare');
      this.counterService.subject.next(0);
    }
    this.flagForClearComparison = true;
    setTimeout(() => {
      this.flagForClearComparison = false;
    }, 3000);
  }

  checkValue(productId: number) {
    if (!localStorage.compare) {
      return false;
    } else {
      if (JSON.parse(localStorage.compare).items.includes(productId)) {
        return true;
      } else {
        return false;
      }
    }
  }

}