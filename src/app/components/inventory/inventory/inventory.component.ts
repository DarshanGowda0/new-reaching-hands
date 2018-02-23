import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  category = [
    'Assets', 'Groceries', 'Toiletries', 'Stationary', 'Perishablegoods', 'Miscellaneous', 'Genericmeds'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAdd() {
    this.router.navigate(['add']);
  }

}
