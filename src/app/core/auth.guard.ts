import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.auth.user.pipe(
      take(1),
      map(user => user && this.auth.isAuthorized(user) ? true : false),
      tap(isUser => {
        if (!isUser) {
          this.signInWithGoogle();
          console.error('Access denied - Admins only');
          return false;
        } else {
          console.log('Áccess granted');
          return true;
        }
      }));
  }

  signInWithGoogle(): void {
    this.auth.googleLogin().then(() => this.router.navigate(['']));
  }
}
