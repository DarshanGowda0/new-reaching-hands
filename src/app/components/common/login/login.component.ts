import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private auth: AuthService, private router: Router) {

  }

  ngOnInit() {
    $('#mToolbar').slideUp();
  }

  login() {
    this.signInWithGoogle();
    console.log('clicked');
  }

  signInWithGoogle(): void {
    this.auth.googleLogin().then(() => this.router.navigate(['']));
  }

  ngOnDestroy() {
    $('#mToolbar').slideDown();
  }

}
