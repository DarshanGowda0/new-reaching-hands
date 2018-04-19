import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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


  constructor(private router: Router) { }

  ngOnInit() {

    // if inv => mainArray = category
    // else mainArray = catHS
    // and use mainArray in html

  }

  onAdd() {
    this.router.navigate(['add']);
  }

}
