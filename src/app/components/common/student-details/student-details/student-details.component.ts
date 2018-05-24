import { Component, OnInit,  AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../core/auth.service';
import { DataService } from '../../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../core/user';
import { tap, map } from 'rxjs/operators';
import { StudentLog, StudentLog2 } from '../../../../models/student-logs';
import { AddStudentLogComponent } from '../add-student-log/add-student-log.component';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  category = [
     'Student Details'
  ];

  displayedColumns = ['studentName', 'dateOfBirth', 'fathersName', 'emailId', 'edit', 'delete'];
  user: User;
  studentLog2: StudentLog2 = {} as StudentLog2;
  constructor(public snackBar: MatSnackBar, private auth: AuthService,
    private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.user.subscribe(params => {
      this.dataService.getStudentLogById(params.uid).subscribe(item => {
        this.studentLog2 = item;
      });
    });
  }

  addNewLog() {
    const dialogRef = this.dialog.open(AddStudentLogComponent, {
      width: '450px',
      data: {
        'studentLog': undefined,
        'studentLog2': this.studentLog2
      },
      disableClose: true
    });
  }

  ngAfterViewInit() {
    this.auth.user.subscribe(params => {
      console.log(params.uid);
      this.dataService.getLogsofStudents().subscribe(val => {
        this.dataSource = new MatTableDataSource(val);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
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
        this.dataService.deleteStudentLogById(logId).then(() => {
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
  onEdit(studentLog) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canEdit(val)) {
        const dialogRef = this.dialog.open(AddStudentLogComponent, {
          width: '450px',
          data: {
            'studentLog': studentLog,
            'studentLog2': this.studentLog2
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
