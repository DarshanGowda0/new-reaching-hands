import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddNewComponent } from '../../common/add-new/add-new.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  category = [
    'School', 'Homeschool', 'Extracurricular', 'Tutorials', 'Miscellaneous3'
  ];

  constructor(private router: Router,  private dialog: MatDialog) { }

  ngOnInit() {
  }

  onAdd() {
  // this.router.navigate(['add']);
  const dialogRef = this.dialog.open(AddNewComponent, {
    width: '450px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed =>', result);
  });
  }


}
