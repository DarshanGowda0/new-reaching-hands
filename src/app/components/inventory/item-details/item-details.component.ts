import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { ItemLog } from '../../../models/item-log';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../../../models/item';
import { AddLogComponent } from '../add-log/add-log.component';
import { tap, map } from 'rxjs/operators';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit, AfterViewInit {

  google: any;

  item: Item = {} as Item;
  currentQuantity = 0;

  displayedColumns = ['date', 'quantity', 'cost', 'type', 'selectedCommons', 'edit', 'delete'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public snackBar: MatSnackBar, private auth: AuthService, private route: ActivatedRoute,
    private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.google = this.route.snapshot.data.google;
    this.route.params.subscribe(params => {
      this.item.itemId = params['id'];
      this.dataService.getItemById(this.item.itemId).subscribe(item => {
        this.item = item;
      });
    });
  }

  ngAfterViewInit() {
    this.dataService.getLogsOfItem(this.item.itemId).pipe(
      tap(val => {
        this.currentQuantity = this.getCurrentQuantity(val);
      })
    ).subscribe(val => {
      this.dataSource = new MatTableDataSource(val);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getCurrentQuantity(val) {
    let quantity = 0;
    val.forEach(element => {
      if (element.logType === this.logTypeOptions[1]) {
        quantity = quantity - element.quantity;
      } else {
        quantity = quantity + element.quantity;
      }
    });
    return quantity;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNewLog() {
    const dialogRef = this.dialog.open(AddLogComponent, {
      width: '450px',
      data: {
        'itemLog': undefined,
        'item': this.item
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed =>', result);
    });
  }

  popUp(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }

  onDelete(logId) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canDelete(val)) {
        this.dataService.deleteLogById(logId).then(() => {
          console.log('deleted succesfully');
        }).catch(err => {
          console.error('error in deleting', err);
          alert('error while deleting!');
        });
      } else {
        console.log('No Access to Delete');
        this.popUp('Not Admin : ', 'No Access to Delete');
      }
    });
  }

  onEdit(itemLog) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canEdit(val)) {
        const dialogRef = this.dialog.open(AddLogComponent, {
          width: '450px',
          data: {
            'itemLog': itemLog,
            'item': this.item
          },
          disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed =>', result);
        });
      } else {
        console.log('No Access to Edit');
        this.popUp('Not Admin : ', 'No Access to Edit');
      }
    });
  }

}
