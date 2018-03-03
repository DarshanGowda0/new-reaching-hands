import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { User } from '../../../core/user';
import { DataService } from '../../../core/data-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  constructor(private route: ActivatedRoute, private afs: AngularFirestore,
    private dataService: DataService) { }

  onCheckEditor($even, uid) {
    this.afs.collection<User>(`users`).doc(uid).set({
      checkEditor: $even.checked
    }, { merge: true });
  }


  onCheckAdmin($event, uid) {
    this.afs.collection<User>(`users`).doc(uid).set({
      checkAdmin: $event.checked
    }, { merge: true });

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const path = `users`;
    this.detailsCollection = this.afs.collection<User>(path);

    this.detailsCollection.valueChanges().subscribe(val => {
      console.log(val, 'valffffffffffffffff');
      this.dataSource = new MatTableDataSource(val);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

}
