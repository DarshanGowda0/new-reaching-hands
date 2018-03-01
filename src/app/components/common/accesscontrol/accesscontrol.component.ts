import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { User } from '../../../core/user';
import { DataService } from '../../../core/data-service.service';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-accesscontrol',
  templateUrl: './accesscontrol.component.html',
  styleUrls: ['./accesscontrol.component.css']
})
export class AccesscontrolComponent implements OnInit, AfterViewInit {
  user: User = {} as User;
  

  displayedColumns = ['email', 'checkAdmin', 'checkEditor'];
  roles = ['Admin', 'Editor'];
  ELEMENT_DATA: User[] = [];
  // checked: boolean;
  // let checked: boolean = false;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


   private detailsCollection: AngularFirestoreCollection<User>;
  // constructor(private route: ActivatedRoute, private afs: AngularFirestore, private dialog: MatDialog,
  //    public dialogRef: MatDialogRef<AccesscontrolComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
  //   this.user = data.item;
  //   if (data.user) {
  //     this.user = data.user;
  //   }
  // }
  constructor(private route: ActivatedRoute, private afs: AngularFirestore,  private dataService: DataService, private dialog: MatDialog){
  

  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    const path = `users`;
    this.detailsCollection = this.afs.collection<User>(path);
    
    this.detailsCollection.valueChanges().subscribe(val => {
      console.log(val, 'valffffffffffffffff');
      for (let i  in val) {
        if(val[i].roles.admin)
        val[i].checkAdmin = true;
        if(val[i].roles.editor)
        val[i].checkEditor = true;  
      }
      this.dataSource = new MatTableDataSource(val);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

}
