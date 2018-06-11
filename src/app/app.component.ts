import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OnDestroy, OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './core/auth.service';
import { tap, map, take } from 'rxjs/operators';
import { MessagingService } from './core/messaging-service.service';
import 'rxjs/add/operator/take';
import { DataService } from './core/data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {


  mobileQuery: MediaQueryList;
  misc = ['AccessControl', 'Reimbursement', 'Student Details'];
  category = ['HomeSchoolInventory', 'Inventory', 'Projects', 'Services', 'Education', 'Maintenance'];
  reports = ['Summary-level', 'Category-level', 'SubCategory-level'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  private _mobileQueryListener: () => void;
  email: string;
  roles: string;
  image: string;
  nameHash = new Map();
  cat: string;
  banner = 'on';
  constructor(public auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router, private afs: AngularFirestore, public msg: MessagingService, private dataService: DataService) {
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

  setCat(value) {
    this.cat = value;
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

  processData(logs) {
    const costData = [];
    let dataHash = new Map();

    logs.forEach(log => {
      if (log.logType !== this.logTypeOptions[1]) {
        if (dataHash.has(log.date)) {
          const previousCost = dataHash.get(log.date);
          dataHash.set(log.date, previousCost + log.cost);
        } else {
          dataHash.set(log.date, log.cost);
        }
      }
    });

    const leastDate = this.getLeastDate(dataHash);
    dataHash = this.convertDates(dataHash, leastDate);

    return dataHash;

  }

  convertDates(dataHash, leastDate) {
    const newHash = new Map();
    dataHash.forEach((value, date) => {
      const presentDate = new Date(date);
      newHash.set(this.dateDiffInDays(leastDate, presentDate), value);
    });

    return newHash;
  }

  onClick(){
    this.banner = 'off';

  }

  getLeastDate(dates) {
    let lowDate = new Date('12/31/3000');
    dates.forEach((value, date) => {
      const tempDate = new Date(date);
      if (tempDate < lowDate) {
        lowDate = tempDate;
      }
    });
    return lowDate;
  }

  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }



  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


}
