import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './core/auth.service';
import { NotificationService } from './core/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  fillerNav = ['Inventory', 'Services', 'Education', 'Maintenance', 'AccessControl'];
  private _mobileQueryListener: () => void;

  constructor(public auth: AuthService, public notification: NotificationService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router, private afs: AngularFirestore) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  onHome() {
    console.log('home clicked');
    this.router.navigate(['']);
  }

  sendNotification(){
    console.log('clicked send notification'); 
    this.notification.getPermission();  
    this.notification.receiveMessage();
    console.log(this.notification.currentMessage);
  }
  
  signOut(): void {
    this.auth.signOut();
    console.log('signed out');
  }
}
