import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-cat-listing2',
  templateUrl: './sub-cat-listing2.component.html',
  styleUrls: ['./sub-cat-listing2.component.css']
})
export class SubCatListing2Component implements OnInit {
  @Input() subCategory: string;

  nColumns: number;
  items: Observable<Item[]>;

  constructor(private dataService: DataService, private router: Router) {
    const mWidth = window.innerWidth;
    this.setWidth(mWidth);
  }

  ngOnInit() {
    this.items = this.dataService.getItems(this.subCategory, '');
  }

  setWidth(element) {
    if (element < 950) {
      this.nColumns = 2;
    }

    if (element > 950) {
      this.nColumns = 3;
    }

    if (element > 1200) {
      this.nColumns = 4;
    }

    if (element < 650) {
      this.nColumns = 1;
    }
  }

  onResize(event) {
    const mWidth = event.target.innerWidth;
    this.setWidth(mWidth);
  }

  search($event) {
    const query = $event.target.value;
    if (query) {
      this.items = this.dataService.getItems(this.subCategory, query);
      console.log('called');
    } else {
      this.items = this.dataService.getItems(this.subCategory, '');
    }
  }

  onTap(id) {
    this.router.navigate(['item-details2', id]);
  }

  onDelete(id) {
    this.dataService.deleteItemById(id).then(() => {
      console.log('deleted item succesfully');
    }).catch(err => {
      console.error('error while deletng', err);
      alert('error in deleting');
    });
  }

}
