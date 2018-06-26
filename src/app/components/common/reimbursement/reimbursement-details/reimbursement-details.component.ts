import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { AddReimbursementLogComponent } from '../add-reimbursement-log/add-reimbursement-log.component';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../core/auth.service';
import { DataService } from '../../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReimbursementLog } from '../../../../models/reimbursement-log';
import { tap, map, take } from 'rxjs/operators';
import { User } from '../../../../core/user';

@Component({
  selector: 'app-reimbursement-details',
  templateUrl: './reimbursement-details.component.html',
  styleUrls: ['./reimbursement-details.component.css']
})
export class ReimbursementDetailsComponent implements OnInit, AfterViewInit {

  @Input() currentStatus: string;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [];
  allColumns = ['itemName', 'dateOfPurchase', 'billNumber', 'totalCost', 'edit', 'delete', 'approve'];
  approvedColums = ['itemName', 'dateOfPurchase', 'billNumber', 'totalCost'];
  user: User;
  stat = 'closed';
  constructor(public snackBar: MatSnackBar, private auth: AuthService,
    private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.currentStatus === 'closed') {
      this.displayedColumns = this.approvedColums;
    } else {
      this.displayedColumns = this.allColumns;
    }
  }
  addNewLog() {
    const dialogRef = this.dialog.open(AddReimbursementLogComponent, {
      width: '450px',
      data: {
        'reimbursementlog': undefined,
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
      let isAdmin = false;
      if (params.checkAdmin != null) {
        isAdmin = params.checkAdmin;
      }
      this.dataService.getLogsofReimbursement(params.uid, this.currentStatus, isAdmin).subscribe(val => {
        this.dataSource = new MatTableDataSource(val);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
    this.stat = this.currentStatus;
    console.log('status is', this.stat);
  }

  onDelete(logId) {
    this.auth.user.pipe(take(1)).subscribe(val => {
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
    this.auth.user.pipe(take(1)).subscribe(val => {
      if (this.auth.canEdit(val)) {
        const dialogRef = this.dialog.open(AddReimbursementLogComponent, {
          width: '450px',
          data: {
            'reimbursementLog': reimbursementLog,
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
  approvalByAdmin(element) {
    this.auth.user.pipe(take(1)).subscribe(val => {
      if (this.auth.canApprove(val)) {
        this.dataService.onApprovalByAdmin(element).then(() => {
          console.log('The reimbursement log was approved');
        }).catch(err => {
          console.error('error in approving', err);
          alert('error while approving!');
        });
      } else {
        console.log('No Access to Approve');
        this.popUp('Not Admin : ', 'No Access to Approve');
      }
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isCurrentTab() {
    if (this.stat === 'open') {
      return true;
    }
    return false;
  }
}
