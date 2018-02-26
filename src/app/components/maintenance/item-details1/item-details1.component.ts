import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { ItemLog1 } from '../../../models/item-log';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../../../models/item';
import { AddLog1Component } from '../add-log1/add-log1.component';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-item-details1',
  templateUrl: './item-details1.component.html',
  styleUrls: ['./item-details1.component.css']
})
export class ItemDetails1Component implements OnInit, AfterViewInit {

  item: Item = {} as Item;
  currentQuantity = 0;

  displayedColumns = ['serviceDate', 'servicer', 'billNumber', 'cost', 'type', 'selectedCommons', 'edit', 'delete'];
  logTypeOptions = ['Added', 'Supplied', 'Donated'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.item.itemId = params['id'];
      this.dataService.getItemById(this.item.itemId).subscribe(item => {
        this.item = item;
      });
    });
  }

  ngAfterViewInit() {
    this.dataService.getLogsOfItem1(this.item.itemId).pipe(
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
    const dialogRef = this.dialog.open(AddLog1Component, {
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

  onDelete(logId) {
    this.dataService.deleteLogById1(logId).then(() => {
      console.log('deleted succesfully');
    }).catch(err => {
      console.error('error in deleting', err);
      alert('error while deleting!');
    });
  }

  onEdit(itemLog) {
    const dialogRef = this.dialog.open(AddLog1Component, {
      width: '450px',
      data: {
        'itemLog1': itemLog,
        'item': this.item
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed =>', result);
    });
  }


}
