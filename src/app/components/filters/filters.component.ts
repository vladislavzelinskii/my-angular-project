import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { FormArray, FormBuilder } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  queryCategory: Params = {};

  filters: Array<string> = [];
  selectedCategoriesValues: string[] = [];

  filtersForm: any;

  filter$: any;
  filterss: any;


  constructor(private router: Router,
    private fb: FormBuilder,
    firestore: AngularFirestore,
  ) {
    this.filter$ = firestore.collection('filters').valueChanges()
      .pipe(
        map(res => {
          this.filter$ = res;
          this.filters = this.filter$.map((element: any) => {
            return element.name;
          })
        })
      )
      .subscribe(x => this.createFiltersForm());
  }

  createFiltersForm() {
    this.filtersForm = this.fb.group({
      categories: this.addCategoriesControl()
    })
  }
  

  addCategoriesControl() {

    let urlTree = this.router.parseUrl(this.router.url);

    const arr = this.filters.map(element => {
      if (!urlTree.queryParams['category']) {
        return this.fb.control(false);
      } else if (urlTree.queryParams['category'].includes(element)) {
        return this.fb.control(true);
      } else {
        return this.fb.control(false);
      }
    });

    return this.fb.array(arr);
  }

  get categoriesArray() {
    return this.filtersForm.get('categories') as FormArray;
  }

  getSelectedCategoriesValue() {
    this.selectedCategoriesValues = [];
    this.categoriesArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedCategoriesValues.push(this.filters[i]);
      }
    });

    let urlTree = this.router.parseUrl(this.router.url);

    if (this.selectedCategoriesValues.join(',') === '') {
      this.router.navigate([], {
        queryParams: {
          'category': null
        },
        queryParamsHandling: 'merge'
      });
    } else {
      urlTree.queryParams['category'] = this.selectedCategoriesValues.join(',');
      this.router.navigateByUrl(urlTree);
    }
  }


  ngOnInit(): void {

  }

}
