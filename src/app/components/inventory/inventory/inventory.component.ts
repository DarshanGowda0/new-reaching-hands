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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAdd() {
    this.router.navigate(['add']);
  }

}
