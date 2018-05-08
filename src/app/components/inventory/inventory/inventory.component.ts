import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddNewComponent } from '../../common/add-new/add-new.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {


  category = [
    'Assets', 'Groceries', 'Toiletries', 'Stationary', 'Perishablegoods', 'Miscellaneous1', 'Genericmeds', 'Utilities'
  ];

  categoryHS = [
    // tslint:disable-next-line:max-line-length
    'Assets-HS', 'Groceries-HS', 'Stationary-HS', 'Toiletries-HS', 'Perishablegoods-HS', 'Miscellaneous-HS', 'Genericmeds-HS', 'Utilities-HS'
  ];

  mainArray = [this.category, this.categoryHS];


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
