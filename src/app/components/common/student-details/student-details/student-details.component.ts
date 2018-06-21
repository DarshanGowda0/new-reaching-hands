import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../core/auth.service';
import { DataService } from '../../../../core/data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../core/user';
import { tap, map, take } from 'rxjs/operators';
import { StudentLog, StudentLog2 } from '../../../../models/student-logs';
import { AddStudentLogComponent } from '../add-student-log/add-student-log.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit, AfterViewInit {

  category = [
    'Student Details'
  ];


  nColumns: number;
  students: Observable<StudentLog[]>;

  user: User;
  constructor(public snackBar: MatSnackBar, private auth: AuthService,
    private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit() {
    this.students = this.dataService.getLogsofStudents();
  }

  addNewLog() {
    const dialogRef = this.dialog.open(AddStudentLogComponent, {
      width: '450px',
      disableClose: true
    });
  }

  ngAfterViewInit() {
    this.auth.user.subscribe(params => {
      console.log(params.uid);
      this.dataService.getLogsofStudents().subscribe(val => {

      });
    });
  }

  popUp(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }
  onDelete(logId) {
    this.auth.user.pipe(take(1)).subscribe(val => {
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
    this.auth.user.pipe(take(1)).subscribe(val => {
      if (this.auth.canEdit(val)) {
        const dialogRef = this.dialog.open(AddStudentLogComponent, {
          width: '450px',
          data: {
            'studentLog': studentLog,
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

  getAge(birthday) { // birthday is a date
    console.log(birthday.toDate());
    // birthday = birthday.toDate();
    // const ageDifMs = Date.now() - birthday.getTime();
    // const ageDate = new Date(ageDifMs); // miliseconds from epoch
    // return Math.abs(ageDate.getUTCFullYear() - 1970);
    return 22;
  }

  openFolder(folderId) {
    console.log('clicked for ', folderId);
    this.router.navigate(['student-folder', folderId]);
  }
}
