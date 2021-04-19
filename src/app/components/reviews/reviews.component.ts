import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Review } from 'src/app/models/review';
import firebase from 'firebase/app';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  item: Observable<Product>;
  review!: Review;

  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
  ) {
    const id = +this.route.snapshot.params['id'];
    this.item = firestore.collection('products', ref => {
      return ref.where('id', '==', id)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      }));
  }

  ngOnInit(): void {
  }


  addReviewForm = new FormGroup({
    rating: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
  })

  addReview(id: number) {

    // this.firestore.collection('products').doc(id.toString()).update({
    //   reviews: firebase.firestore.FieldValue.arrayUnion({
    //     rating: +this.addReviewForm.value.rating,
    //     text: this.addReviewForm.value.text,
    //     userId: 0,
    //     userName: 'admin',
    //   })
    // });

    // this.firestore.collection('products').doc(id.toString()).update({
    //   reviews.push({
    //     rating: +this.addReviewForm.value.rating,
    //     text: this.addReviewForm.value.text,
    //     userId: 0,
    //     userName: 'admin',
    //   })
    // });


    let averageRating: any;
    
    let a = this.firestore.collection('products').valueChanges().pipe(
      first(), map((products: any) => {
        products.map((element: any) => {
          if (element.id == id) {
            let averageRating = element.averageRating;
            console.log(averageRating);
            let arrayOfReviews = element.reviews || [];
            console.log(+this.addReviewForm.value.rating);

            arrayOfReviews.push({
              rating: +this.addReviewForm.value.rating,
              text: this.addReviewForm.value.text,
              userId: 0,
              userName: 'admin',
            });

            let arrayOfRating: any = [];
            arrayOfReviews.map((review: any) => {
              arrayOfRating.push(review.rating);
            });
            let summRating = arrayOfRating.reduce((currentValue: any, previousValue: any) => {
                return  previousValue + currentValue;
              })
            averageRating = summRating/arrayOfReviews.length;
            this.firestore.collection('products').doc(id.toString()).update({
              averageRating: averageRating,
              reviews: arrayOfReviews,
            });

            this.addReviewForm.reset();

          }
          return element;
        })
        return products;
      })
    ).subscribe();

  }


}
