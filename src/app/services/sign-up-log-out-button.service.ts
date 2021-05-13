import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpLogOutButtonService {

  subject = new BehaviorSubject(false);

  constructor() {
    localStorage.user ? this.subject.next(true) : this.subject.next(false);
  }
}