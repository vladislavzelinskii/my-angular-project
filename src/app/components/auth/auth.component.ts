import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { emailValidator, passwordValidator, passwordConfirmValidator } from 'src/app/validators/sign-in-sign-up-validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isSignedIn!: boolean;

  flagForRegisterOfSignIn: boolean = true;

  signUpForm!: FormGroup;
  signInForm!: FormGroup;

  flagPasswordOrText!: boolean;
  flagPasswordConfirmOrText!: boolean;
  flagPasswordSignInOrText!: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.signUpForm = this.fb.group({
      emailSignUp: ['', [emailValidator()]],
      passwordSignUp: ['', [passwordValidator()]],
      passwordConfirm: [],
    }, { validator: passwordConfirmValidator("passwordSignUp", "passwordConfirm") });
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

  public onSignup(email: string, password: string) {
    this.authService.signup(email, password).pipe(
      tap(() => {
        if (this.authService.isLoggedIn) {
          this.isSignedIn = true;
          this.router.navigateByUrl('');
        }
      })
    ).subscribe();

  }

  public onSignin(email: string, password: string) {
    this.authService.signin(email, password).pipe(
      tap(() => {
        if (this.authService.isLoggedIn) {
          this.isSignedIn = true;
          this.router.navigateByUrl('');
        }
      })
    ).subscribe();

  }

  handleLogout() {
    this.isSignedIn = false;
  }

  public googleSignin() {
    this.authService.googleSignin().pipe(
      tap(() => {
        this.router.navigateByUrl('');
      })
    ).subscribe();
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

  toggleFlagPasswordOrText() {
    this.flagPasswordOrText = true;
    setTimeout(() => {
      this.flagPasswordOrText = false;
    }, 1000);
  }
  toggleFlagPasswordConfirmOrText() {
    this.flagPasswordConfirmOrText = true;
    setTimeout(() => {
      this.flagPasswordConfirmOrText = false;
    }, 1000);
  }
  toggleFlagSignInPasswordOrText() {
    this.flagPasswordSignInOrText = true;
    setTimeout(() => {
      this.flagPasswordSignInOrText = false;
    }, 1000);
  }

  get emailSignUp() {
    return this.signUpForm.get('emailSignUp');
  }
  get passwordSignUp() {
    return this.signUpForm.get('passwordSignUp');
  }
  get passwordConfirm() {
    return this.signUpForm.get('passwordConfirm');
  }
  get emailSignIn() {
    return this.signInForm.get('emailSignIn');
  }
  get passwordSignIn() {
    return this.signInForm.get('passwordSignIn');
  }

}
