import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddNewComponent } from '../../common/add-new/add-new.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  category = [
    'Studentpersonalcare', 'Medicalcare', 'Transportation', 'Miscellaneous2'
  ];

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
  }

  onAdd() {
    // this.router.navigate(['add']);
    const dialogRef = this.dialog.open(AddNewComponent, {
      width: '450px',
      data: {
        'category': 'Services'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed =>', result);
    });
  }


}
