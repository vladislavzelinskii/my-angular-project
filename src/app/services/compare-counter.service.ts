import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompareCounterService {

  subject = new BehaviorSubject(0);

  constructor() {
    if (localStorage.compare) {
      this.subject.next(JSON.parse(localStorage.compare).items.length)
    }
  }
}