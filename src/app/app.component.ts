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
import * as tf from '@tensorflow/tfjs';

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
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  private _mobileQueryListener: () => void;
  email: string;
  roles: string;
  image: string;
  nameHash = new Map();
  cat: string;

  constructor(public auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router, private afs: AngularFirestore, public msg: MessagingService, private dataService: DataService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.loadUserDetails();
    this.trainSummaryModel();
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

  // comupteDataForLineChart(val) {
  //   const costData = [];
  //   const dataHash = new Map();
  //   const dateToData = new Map();

  //   val.forEach(element => {

  //     const tempDate = new Date(element.date);

  //     if (element.logType !== this.logTypeOptions[1]) {
  //       if (dataHash.has(element.date)) {
  //         const previousCost = dataHash.get(element.date);
  //         dataHash.set(element.date, previousCost + element.cost);

  //         const tempArray = dateToData.get(element.date);
  //         tempArray.push(element);
  //         dateToData.set(element.date, tempArray);
  //       } else {
  //         dataHash.set(element.date, element.cost);

  //         const elementDataArray = new Array();
  //         elementDataArray.push(element);
  //         dateToData.set(element.date, elementDataArray);
  //       }
  //     }
  //   });

  //   const dataArray = new Array();
  //   dataHash.forEach((value, key) => {
  //     dataArray.push({
  //       'date': key,
  //       'cost': value
  //     });
  //   });

  //   dataArray.sort((a, b) => {
  //     const aDate = new Date(b.date);
  //     const bDate = new Date(a.date);
  //     return (bDate > aDate ? 1 : -1);
  //   });

  //   dataArray.forEach(element => {
  //     const row = [];

  //     row.push(new Date(element.date));
  //     row.push(element.cost);
  //     row.push(element.cost - 300);
  //     row.push(element.cost + 300);
  //     costData.push(row);

  //   });
  //   this.train(dataArray, costData, dateToData);

  // }

  async trainSummaryModel() {
    this.dataService.getSummary()
      .pipe(
        map(logs => {
          logs.forEach(item => {
            item.date = this.dateFormat(item.date);
          });
          return logs;
        })
      )
      .subscribe(logs => {
        const dataHash = this.processData(logs);
        this.trainModel(dataHash);
      });
  }

  async trainModel(dataHash) {
    let linearModel: tf.Sequential;
    linearModel = tf.sequential();
    linearModel.add(tf.layers.dense({
      units: 1,
      inputShape: [1],
      // activation: 'relu'
    }));
    // linearModel.add(tf.layers.dense({units: 5, activation: 'relu'}));
    // linearModel.add(tf.layers.dense({ units: 1, activation: 'linear' }));


    linearModel.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd',
      metrics: ['accuracy']
    });

    const xArray = [];
    const yArray = [];

    dataHash.forEach((value, key) => {
      xArray.push(key);
      yArray.push(value);
    });

    // const xs = tf.tensor1d(xArray);
    // const ys = tf.tensor1d(yArray);

    const xs = tf.tensor1d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const ys = tf.tensor1d([100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]);

    xs.print();
    ys.print();

    const history = await linearModel.fit(xs, ys, { epochs: 2000 });

    // get weights
    const weight = linearModel.layers[0].getWeights();

    const linearModel2 = tf.sequential();
    linearModel2.add(tf.layers.dense({
      units: 1,
      inputShape: [1],
    }));


    linearModel2.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd',
      metrics: ['accuracy']
    });

    linearModel2.layers[0].setWeights(weight);

    console.log('model trained!', history.history);
    const output = linearModel.predict(tf.tensor2d([12], [1, 1])) as any;
    const prediction = Array.from(output.dataSync())[0];
    console.log('pred ', prediction);

    const output2 = linearModel2.predict(tf.tensor2d([12], [1, 1])) as any;
    const prediction2 = Array.from(output2.dataSync())[0];
    console.log('pred ', prediction2);

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
