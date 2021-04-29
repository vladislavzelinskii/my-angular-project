import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { emailValidator, passwordValidator } from 'src/app/shared/signInSignUpValidators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isSignedIn: boolean = false;

  flagForRegisterOfSignIn: boolean = true;

  signUpForm!: FormGroup;
  signInForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {

    this.signUpForm = this.fb.group({
      emailSignUp: ['', [emailValidator()]],
      passwordSignUp: ['', [passwordValidator()]],
    });
    this.signInForm = this.fb.group({
      emailSignIn: ['', [emailValidator()]],
      passwordSignIn: ['', [passwordValidator()]],
    });

    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false
    }
  }

  async onSignup(email: string, password: string) {
    await this.authService.signup(email, password)
    if (this.authService.isLoggedIn) {
      this.isSignedIn = true;
      this.router.navigateByUrl('');
    }
  }
  async onSignin(email: string, password: string) {
    await this.authService.signin(email, password)
    if (this.authService.isLoggedIn) {
      this.isSignedIn = true;
      this.router.navigateByUrl('');
    }
  }
  handleLogout() {
    this.isSignedIn = false;
  }

  googleSignin() {
    this.authService.googleSignin();
  }

  changeFlagToSignIn() {
    this.signUpForm = this.fb.group({
      emailSignUp: ['', [emailValidator()]],
      passwordSignUp: ['', [passwordValidator()]],
    });
    this.flagForRegisterOfSignIn = true;
  }
  changeFlagToSignUp() {
    this.signInForm = this.fb.group({
      emailSignIn: ['', [emailValidator()]],
      passwordSignIn: ['', [passwordValidator()]],
    });
    this.flagForRegisterOfSignIn = false;
  }

  get emailSignUp() {
    return this.signUpForm.get('emailSignUp');
  }
  get passwordSignUp() {
    return this.signUpForm.get('passwordSignUp');
  }
  get emailSignIn() {
    return this.signInForm.get('emailSignIn');
  }
  get passwordSignIn() {
    return this.signInForm.get('passwordSignIn');
  }

}
