import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { User } from '../../../core/user';
import { DataService } from '../../../core/data-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-accesscontrol',
  templateUrl: './accesscontrol.component.html',
  styleUrls: ['./accesscontrol.component.css']
})
export class AccesscontrolComponent implements OnInit, AfterViewInit {
  user: User = {} as User;


  displayedColumns = ['email', 'checkAdmin', 'checkEditor'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  private detailsCollection: AngularFirestoreCollection<User>;
  constructor(public snackBar: MatSnackBar, private auth: AuthService, private route: ActivatedRoute, private afs: AngularFirestore,
    private dataService: DataService) { }


  popUp(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 2500,
      });
    }

  onCheckEditor($even, uid) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canAccess(val)) {
    this.afs.collection<User>(`users`).doc(uid).set({
      checkEditor: $even.checked
    }, { merge: true });
  } else {
    console.log('No Access to Modify');
    this.popUp('Not Admin : ', 'No Access');
  }
});
  }


  onCheckAdmin($event, uid) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canAccess(val)) {if(uid != val.uid){
    this.afs.collection<User>(`users`).doc(uid).set({
      checkAdmin: $event.checked
    }, { merge: true });
  }else{
    this.popUp('Hey Admin, ', 'Action denied');
  }
  } else {
    console.log('No Access to Modify');
    this.popUp('Not Admin : ', 'No Access');
  }
});

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const path = `users`;
    this.detailsCollection = this.afs.collection<User>(path);

    this.detailsCollection.valueChanges().subscribe(val => {
      this.dataSource = new MatTableDataSource(val);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
