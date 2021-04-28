import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CompareCounterService } from 'src/app/services/compare-counter.service';

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

  allProducts: any = [];
  productsAfterFilter: any = [];
  currentProductsOnPage: any = [];
  currentPage: any = 1;
  itemsPerPage: any = 4;

  checkbox: any = true;

  arrayOfIdForCompare: any;

  showListOfSort: boolean = false;

  currentOrder: string = 'Default';

  condition: {order?: string, desc?: any} = {};

  flagForLoader: boolean = false;

  compareCounter!: number;
  flagForClearComparison: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    // private productService: ProductService,  
    private firestore: AngularFirestore,
    private router: Router,
    private counterService: CompareCounterService,
  ) {}

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

    // console.log(this.productsAfterFilter);

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
      if ((flag >= this.itemsPerPage*(this.currentPage-1)) && (flag < this.itemsPerPage*this.currentPage)) {
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
      if ((flag >= this.itemsPerPage*(this.currentPage-1)) && (flag < this.itemsPerPage*this.currentPage)) {
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

  closeList($event: any) {
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
        // console.log(compareValue.items);
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
    }

    

    // console.log(localStorage);

    // let keysInLocalStorage = Object.keys(localStorage);

    // if (keysInLocalStorage.length > 4 && event.target.checked) {
    //   alert("The number of compared items should not be more than 5!");
    //   event.preventDefault();
    // } else if (keysInLocalStorage.length > 4 && !event.target.checked) {
    //   localStorage.removeItem(productId.toString());
    // } else if (keysInLocalStorage.length === 0 && event.target.checked) {
    //   localStorage.setItem('category', category);
    //   localStorage.setItem(productId.toString(), event.target.checked);
    // } else if (keysInLocalStorage.length === 2 && !event.target.checked) {
    //   localStorage.removeItem('category');
    //   localStorage.removeItem(productId.toString());
    // } else if (keysInLocalStorage.length < 5) {
    //   if (event.target.checked && localStorage.category === category) {
    //     localStorage.setItem(productId.toString(), event.target.checked);
    //   } else if (event.target.checked && localStorage.category !== category) {
    //     alert("Select a product of the same category");
    //     event.preventDefault();
    //   } else {
    //     localStorage.removeItem(productId.toString());
    //   }
    // }
    
    // keysInLocalStorage = Object.keys(localStorage);

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
