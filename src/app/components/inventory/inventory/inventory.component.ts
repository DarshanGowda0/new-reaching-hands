import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddNewComponent } from '../../common/add-new/add-new.component';
import { MatDialog } from '@angular/material';
import { AppComponent } from '../../../app.component';

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
    'Assets-HS', 'Groceries-HS', 'Toiletries-HS', 'Stationary-HS', 'Perishablegoods-HS', 'Miscellaneous-HS', 'Genericmeds-HS', 'Utilities-HS'
  ];

  cat: string;

  constructor(private router: Router, private dialog: MatDialog) {
    }

  ngOnInit() {
    // if inv => mainArray = category
    // else mainArray = catHS
    // and use mainArray in html

  }

  getCat(index) {
    if (this.router.url === '/HomeSchoolInventory') {
      this.cat = 'HomeSchoolInventory';
      return this.categoryHS[index];
    } else {
      this.cat = 'Inventory';
      return this.category[index];
    }
  }

  onAdd() {
    // this.router.navigate(['add']);

    const dialogRef = this.dialog.open(AddNewComponent, {
      width: '450px',
      data: {
        'category': this.cat
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed =>', result);
    });
  }

}
