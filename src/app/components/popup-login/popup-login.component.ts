import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-login',
  templateUrl: './popup-login.component.html',
  styleUrls: ['./popup-login.component.scss']
})
export class PopupLoginComponent {

  @Output() onChanged = new EventEmitter<boolean>();

  constructor(
    private router: Router,
  ) { }

  goToLogin() {
    this.router.navigateByUrl('/auth');
    this.onChanged.emit();
  }

  closeLoginPopup() {
    this.onChanged.emit();
  }

}
