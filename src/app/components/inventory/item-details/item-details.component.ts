import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { ItemLog } from '../../../models/item-log';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../../../models/item';
import { AddLogComponent } from '../add-log/add-log.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit, AfterViewInit {

  item: Item = {} as Item;

  displayedColumns = ['date', 'quantity', 'cost', 'type', 'selectedCommons', 'edit', 'delete'];

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
    this.dataService.getLogsOfItem(this.item.itemId).subscribe(val => {
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

  onDelete(logId) {
    this.dataService.deleteLogById(logId).then(() => {
      console.log('deleted succesfully');
    }).catch(err => {
      console.error('error in deleting', err);
      alert('error while deleting!');
    });
  }

  onEdit(itemLog) {
    const dialogRef = this.dialog.open(AddLogComponent, {
      width: '450px',
      data: {
        'itemLog': itemLog,
        'item': this.item
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed =>', result);
    });
  }

}
