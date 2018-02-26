import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  category = [
    'School', 'Homeschool', 'Extracurricular', 'Tutorials'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAdd() {
    this.router.navigate(['add']);
  }


}
