import { Component, OnInit } from '@angular/core';
import { PRODUCTS } from '../mock-products';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products = PRODUCTS;

  queryCategory: Params = {};

  flag: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.queryCategory = data;

      this.flag = true;
      for (let key in this.queryCategory) {
        this.flag = false;
      }
    })
  }




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
