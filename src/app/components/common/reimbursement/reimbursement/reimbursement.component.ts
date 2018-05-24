import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AddReimbursementLogComponent } from '../add-reimbursement-log/add-reimbursement-log.component';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../core/auth.service';
import { DataService } from '../../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReimbursementLog2 } from '../../../../models/reimbursement-log';
import { tap, map } from 'rxjs/operators';
import { User } from '../../../../core/user';


@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css']
})
export class ReimbursementComponent implements OnInit, AfterViewInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  category = [
    'Current Claims', 'All Your Claims'
  ];

  displayedColumns = ['itemName', 'dateOfPurchase', 'billNumber', 'totalCost', 'edit', 'delete'];
  user: User;
  reimbursementLog2: ReimbursementLog2 = {} as ReimbursementLog2;

  constructor(public snackBar: MatSnackBar, private auth: AuthService,
    private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.user.subscribe(params => {
      this.dataService.getReimbursementLogById(params.uid).subscribe(item => {
        this.reimbursementLog2 = item;
      });
    });
  }
  addNewLog() {
    const dialogRef = this.dialog.open(AddReimbursementLogComponent, {
      width: '450px',
      data: {
        'reimbursementlog': undefined,
        'reimbursementLog2': this.reimbursementLog2
      },
      disableClose: true
    });
  }
  popUp(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }
    ngAfterViewInit() {
      this.auth.user.subscribe(params => {
        console.log(params.uid);
        this.dataService.getLogsofReimbursement(params.uid).subscribe(val => {
          this.dataSource = new MatTableDataSource(val);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });
    }
    onDelete(logId) {
      this.auth.user.take(1).subscribe(val => {
        if (this.auth.canDelete(val)) {
          this.dataService.deleteReimbursementLogById(logId).then(() => {
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
    onEdit(reimbursementLog) {
      this.auth.user.take(1).subscribe(val => {
        if (this.auth.canEdit(val)) {
          const dialogRef = this.dialog.open(AddReimbursementLogComponent, {
            width: '450px',
            data: {
              'reimbursementLog': reimbursementLog,
              'reimbursementLog2': this.reimbursementLog2
            },
            disableClose: true
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

