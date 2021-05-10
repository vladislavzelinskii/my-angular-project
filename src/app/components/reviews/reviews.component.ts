import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  product!: Observable<Product>;
  flagLoggedIn!: boolean;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    if (localStorage.user) {
      this.flagLoggedIn = true;
    }
    this.product = this.firestore.collection('products', ref => {
      return ref.where('id', '==', id)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      }));
  }

  addReviewForm = new FormGroup({
    rating: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
  })

  addReview(id: number) {

    let averageRating: any;
    
    let a = this.firestore.collection('products').valueChanges().pipe(
      first(), map((products: any) => {
        products.map((element: any) => {
          if (element.id == id) {
            let averageRating = element.averageRating;
            console.log(averageRating);
            let arrayOfReviews = element.reviews || [];
            console.log(+this.addReviewForm.value.rating);

            let userName = '';

            if (localStorage.user) {
              if (JSON.parse(localStorage.user).displayName) {
                userName = JSON.parse(localStorage.user).displayName;
              } else {
                userName = JSON.parse(localStorage.user).uid;
              }
            } else {
              userName = 'anonim';
            }

            arrayOfReviews.push({
              rating: +this.addReviewForm.value.rating,
              text: this.addReviewForm.value.text,
              userId: JSON.parse(localStorage.user).uid,
              userName: userName,
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
