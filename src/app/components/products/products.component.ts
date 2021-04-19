import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  // products: Product[] = PRODUCTS;

  queryCategory: Params = {};

  flagForNoSelectedCategory: boolean = false;

  // flagForAddToCart: boolean = false;

  products!: Observable<any[]>;

  checkbox: any = true;

  arrayOfIdForCompare: any;

  showListOfSort: boolean = false;

  currentOrder: string = 'unordered';

  constructor(
    private activatedRoute: ActivatedRoute,
    // private productService: ProductService,  
    private firestore: AngularFirestore,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.products = this.firestore.collection('products').valueChanges();

    this.arrayOfIdForCompare = Object.keys(localStorage);

    this.activatedRoute.queryParams.subscribe(data => {
      this.queryCategory = data;

      if (data.order) {
        if (data.order.indexOf(':desc') === -1) {
          this.products = this.firestore.collection('products', ref => ref.orderBy(data.order)).valueChanges();
          this.currentOrder = 'cheap';
        } else {
          this.products = this.firestore.collection('products', ref => ref.orderBy(data.order.replace(':desc', ''), 'desc')).valueChanges();
          this.currentOrder = 'expensive';
        }
      } else {
        this.products = this.firestore.collection('products').valueChanges();
        this.currentOrder = 'Default';
      }

      this.flagForNoSelectedCategory = true;
      
      for (let key in this.queryCategory) {
        if (key === "category") {
          this.flagForNoSelectedCategory = false;
        }
      }

    });

  }
  
  openList($event: any) {
    $event.stopPropagation();
    this.showListOfSort = !this.showListOfSort;
  }

  closeList($event: any) {
    if (this.showListOfSort) {
      this.showListOfSort = false;
    }
  }

  addToCompare(event: any, productId: number) {

    let keysInLocalStorage = Object.keys(localStorage);

    if (keysInLocalStorage.length > 4 && event.target.checked) {
      alert("The number of compared items should not be more than 5!");
      event.preventDefault();
    } else if (keysInLocalStorage.length > 4 && !event.target.checked) {
      localStorage.removeItem(productId.toString());
    } else if (keysInLocalStorage.length < 5) {
      if (event.target.checked) {
        localStorage.setItem(productId.toString(), event.target.checked);
      } else {
        localStorage.removeItem(productId.toString());
      }
    }
    
    keysInLocalStorage = Object.keys(localStorage);

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

  // stopEvent(event: any): void {
  //   event.stopPropagation();
  //   this.showListOfSort = !this.showListOfSort;
  // }

  // SELECTchangeUrlToOrderBy($event: any) {
  //   if ($event === 'unordered') {
  //     this.router.navigate([], {
  //       queryParams: {
  //         'order': null
  //       },
  //       queryParamsHandling: 'merge'
  //     });
  //   } else if ($event === 'priceAsc') {
  //     this.router.navigate(['/products'], { queryParams: { order: 'price' }, queryParamsHandling: 'merge' });
  //   } else if ($event === 'priceDesc') {
  //     this.router.navigate(['/products'], { queryParams: { order: "price:desc" }, queryParamsHandling: 'merge' });
  //   }
  // }


  // addToCart(productId: number, price: number, name: string, image: string) {

  //   console.log('not added')
  // }

  // removeFromCart(productId: number, price: number, name: string, image: string) {
  //   console.log('not removed');
    
  // }


  // addToCart(id: number, price: number) {
  //   this.firestore.collection('cart').doc(id.toString()).set({
  //     id: id,
  //     price: price,
  //     productId: id,
  //     userId: 'defaultUser',
  //   });
  //   alert('added ' + id);
  // }

  // getProducts(): void {
  //   this.productService.getProducts()
  //     .subscribe(products => this.products = products);
  // }




  /*
    isEmptyObject(obj: Object) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    }
  
    removeNeedlessCommasInUrl(url: string): string {
      url = url.replace(',,', ',');
      while (true) {
        if (url.indexOf(',') === 0) {
          url = url.replace(',', '');
        } else if (url.lastIndexOf(',') === (url.length - 1)) {
          url = url.slice(0, -1);
        } else {
          break;
        }
      }
      return url;
    }
  
    changeCategory0(event: any): void {
  
      let urlTree = this.router.parseUrl(this.router.url);
      let queryParamsCategory: string = urlTree.queryParams['category'];
  
      if (event.srcElement.checked) {
        if (this.isEmptyObject(urlTree.queryParams)) {
          queryParamsCategory = 'notebook';
        } else if (queryParamsCategory.indexOf('notebook') === -1) {
          console.log(queryParamsCategory);
          queryParamsCategory += ',notebook';
        }
      } else {
        queryParamsCategory = queryParamsCategory.replace('notebook', '');
        if (queryParamsCategory) {
          queryParamsCategory = this.removeNeedlessCommasInUrl(queryParamsCategory);
        } else {
          this.router.navigate([], {
            queryParams: {
              'category': null
            },
            queryParamsHandling: 'merge'
          });
          return;
        }
      }
  
      urlTree.queryParams['category'] = queryParamsCategory;
      this.router.navigateByUrl(urlTree);
    }
  
    changeCategory1(event: any): void {
  
      let urlTree = this.router.parseUrl(this.router.url);
      let queryParamsCategory: string = urlTree.queryParams['category'];
  
      if (event.srcElement.checked) {
        if (this.isEmptyObject(urlTree.queryParams)) {
          queryParamsCategory = 'phone';
        } else if (queryParamsCategory.indexOf('phone') === -1) {
          console.log(queryParamsCategory);
          queryParamsCategory += ',phone';
        }
      } else {
        queryParamsCategory = queryParamsCategory.replace('phone', '');
        if (queryParamsCategory) {
          queryParamsCategory = this.removeNeedlessCommasInUrl(queryParamsCategory);
        } else {
          this.router.navigate([], {
            queryParams: {
              'category': null
            },
            queryParamsHandling: 'merge'
          });
          return;
        }
      }
  
      urlTree.queryParams['category'] = queryParamsCategory;
      this.router.navigateByUrl(urlTree);
    }
  
    changeCategory2(event: any): void {
  
      let urlTree = this.router.parseUrl(this.router.url);
      let queryParamsCategory: string = urlTree.queryParams['category'];
  
      if (event.srcElement.checked) {
        if (this.isEmptyObject(urlTree.queryParams)) {
          queryParamsCategory = 'printer';
        } else if (queryParamsCategory.indexOf('printer') === -1) {
          console.log(queryParamsCategory);
          queryParamsCategory += ',printer';
        }
      } else {
        queryParamsCategory = queryParamsCategory.replace('printer', '');
        if (queryParamsCategory) {
          queryParamsCategory = this.removeNeedlessCommasInUrl(queryParamsCategory);
        } else {
          this.router.navigate([], {
            queryParams: {
              'category': null
            },
            queryParamsHandling: 'merge'
          });
          return;
        }
      }
  
      urlTree.queryParams['category'] = queryParamsCategory;
      this.router.navigateByUrl(urlTree);
    }
  */
}
