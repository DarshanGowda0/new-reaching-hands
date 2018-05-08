import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddNewComponent } from '../../common/add-new/add-new.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {


  category = [
    'Construction', 'Installation', 'Painting', 'General'
  ];

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit() {

    // if inv => mainArray = category
    // else mainArray = catHS
    // and use mainArray in html

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
