import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  // startAt = new Subject<string>();
  // endAt = new Subject<string> ();
  // products!: Array<Product>;

  flagShowSearch: boolean = false;

  item$: any;
  products: Array<string> = [];

  productsList: any = [];

  id!: number;

  currentValueSearch: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
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
  

  search($event : any) {
    this.flagShowSearch = true;

    this.productsList = [];
    this.currentValueSearch = $event.target.value;

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

  closeSearch($event: any) {
    this.flagShowSearch = false;
  }

  // notClose($event: any) {
  //   $event.stopPropagation();
  //   console.log($event);
  // 
  // }

  // ngOnInit(): void {
  //   this.firequery(this.startAt, this.endAt)
  //       .subscribe((products: Array<Product>) => this.products = products);
  // }

  // search($event : any) {  //KeyboardEvent
  //   let q = $event.target.value;
  //   this.startAt.next(q);
  //   this.endAt.next(q + "\uf8ff");

    
  // }

  // firequery(start: Subject<string>, end: Subject<string>): any {
  //   console.log(start);
  //   return this.firestore.collection<any>('products', ref => ref.limit(4).orderBy('name').startAt(start).endAt(end)).valueChanges();
  // }

}
