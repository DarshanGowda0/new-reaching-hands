import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  category = [
    'Vehicle', 'Campus', 'Monthlybills', 'Miscellaneous'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAdd() {
    this.router.navigate(['add']);
  }


}
