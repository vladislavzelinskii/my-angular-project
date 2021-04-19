import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  startAt = new Subject<string>();
  endAt = new Subject<string> ();
  products!: Array<Product>;

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.firequery(this.startAt, this.endAt)
        .subscribe((products: Array<Product>) => this.products = products);
  }

  search($event : any) {  //KeyboardEvent
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");

    
  }

  firequery(start: Subject<string>, end: Subject<string>): any {
    console.log(start);
    return this.firestore.collection<any>('products', ref => ref.limit(4).orderBy('name').startAt(start).endAt(end)).valueChanges();
  }

}
