import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpLogOutButtonService {

  subject = new BehaviorSubject(false);

  constructor() { 
    if (localStorage.user) {
      this.subject.next(true);
    } else {
      this.subject.next(false);
    }
  }
}
