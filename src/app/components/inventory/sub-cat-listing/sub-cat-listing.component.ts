import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-sub-cat-listing',
  templateUrl: './sub-cat-listing.component.html',
  styleUrls: ['./sub-cat-listing.component.css']
})
export class SubCatListingComponent implements OnInit {

  @Input() subCategory: string;

  nColumns: number;
  items: Observable<Item[]>;

  constructor(public snackBar: MatSnackBar, private auth: AuthService,private dataService: DataService, private router: Router) {
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
    this.router.navigate(['item-details', id]);
  }

  popUp(message: string,action: string) {
    this.snackBar.open(message,action,{
      duration:2500,
    });
  }

  onDelete(id) {
    this.auth.user.take(1).subscribe(val => {
      if (this.auth.canDelete(val)) {
    this.dataService.deleteItemById(id).then(() => {
      console.log('deleted item succesfully');
    }).catch(err => {
      console.error('error while deletng', err);
      alert('error in deleting');
    });
  }
  else{
    this.popUp('Not Admin : ','No Access to Delete');
  }
});
  }

}
