import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddNewComponent } from '../../common/add-new/add-new.component';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  category = [
    'Vehicle', 'Campus', 'Monthlybills', 'Miscellaneous4'
  ];

  constructor(private router: Router, private dialog: MatDialog) { }

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
