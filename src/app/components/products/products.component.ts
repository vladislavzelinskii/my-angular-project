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

  flag: boolean = false;

  // flagForAddToCart: boolean = false;

  products: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    // private productService: ProductService,  
    private firestore: AngularFirestore,
  ) {
    this.products = firestore.collection('products').valueChanges();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.queryCategory = data;

      this.flag = true;
      for (let key in this.queryCategory) {
        this.flag = false;
      }
    });
    // this.getProducts();
  }

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
