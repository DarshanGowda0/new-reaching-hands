import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class CanAccessGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(user => user && this.auth.canAccess(user) ? true : false),
      tap(isUser => {
        if (!isUser) {
          console.error('Access denied - Admins only');
          this.router.navigate(['']);
          return false;
        } else {
          console.log('Áccess granted');
          return true;
        }
      }));
  }
}
