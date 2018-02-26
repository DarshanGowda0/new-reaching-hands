import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  category = [
    'Studentpersonelcare', 'Medicalcare', 'Transportation'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAdd() {
    this.router.navigate(['add']);
  }


}
