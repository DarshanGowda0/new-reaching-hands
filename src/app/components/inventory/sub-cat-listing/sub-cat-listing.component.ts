import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';

@Component({
  selector: 'app-sub-cat-listing',
  templateUrl: './sub-cat-listing.component.html',
  styleUrls: ['./sub-cat-listing.component.css']
})
export class SubCatListingComponent implements OnInit {

  @Input() subCategory: string;

  nColumns: number;
  items: Observable<Item[]>;

  constructor(private dataService: DataService) {
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

}
