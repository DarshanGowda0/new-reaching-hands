import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OnDestroy, OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './core/auth.service';
import { tap, map, take } from 'rxjs/operators';
import { MessagingService } from './core/messaging-service.service';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {


  mobileQuery: MediaQueryList;
  misc = ['AccessControl'];
  category = ['HomeSchoolInventory', 'Inventory', 'Projects', 'Services', 'Education', 'Maintenance'];
  reports = ['Summary-level', 'Category-level', 'SubCategory-level'];
  private _mobileQueryListener: () => void;
  email: string;
  roles: string;
  image: string;

  constructor(public auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router, private afs: AngularFirestore, public msg: MessagingService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.loadUserDetails();
  }

  ngOnInit() {
    this.auth.user
      .filter(user => !!user) // filter null
      .take(1) // take first real user
      .subscribe(user => {
        if (user) {
          this.msg.getPermission(user);
          this.msg.monitorRefresh(user);
          this.msg.receiveMessages();
        }
      });
  }


  loadUserDetails() {
    this.auth.user.subscribe(val => {
      this.email = val.email;
      if ((val.checkEditor)) {
        this.roles = 'editor';
      }
      if ((val.checkAdmin)) {
        this.roles = 'admin';
      }
    });
    this.auth.authUser.subscribe(val => {
      this.image = val.photoURL;
    });
  }



  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  onHome() {
    console.log('home clicked');
    this.router.navigate(['']);
  }

  signOut(): void {
    this.auth.signOut();
    console.log('signed out');
  }


}
