import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {


  category = [
    'Construction', 'Installation', 'Painting', 'General'
  ];

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
