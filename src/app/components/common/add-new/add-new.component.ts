import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';
import { Router } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {

  categoryGroups = [
    {
      name: 'HomeSchoolInventory',
      category: [
        // tslint:disable-next-line:max-line-length
        'Assets-HS', 'Groceries-HS', 'Stationary-HS', 'Toiletries-HS', 'Perishablegoods-HS', 'Miscellaneous-HS', 'Genericmeds-HS', 'Utilities-HS'
      ]
    },
    {
      name: 'Projects',
      category: [
        'Construction', 'Installation', 'Painting', 'General'
      ]
    },
    {
      name: 'Inventory',
      category: [
        'Assets', 'Groceries', 'Stationary', 'Toiletries', 'Perishablegoods', 'Miscellaneous1', 'Genericmeds', 'Utilities'
      ]
    },
    {
      name: 'Services',
      category: [
        'Studentpersonalcare', 'Medicalcare', 'Transportation', 'Miscellaneous2'
      ]
    },
    {
      name: 'Education',
      category: [
        'School', 'Homeschool', 'Extracurricular', 'Tutorials', 'Miscellaneous3'
      ]
    },
    {
      name: 'Maintenance',
      category: [
        'Vehicle', 'Campus', 'Monthlybills', 'Miscellaneous4'
      ]
    }
  ];

  Units = ['kgs', 'grams', 'litres', 'ml', 'numbers'];

  itemName: string;
  selectedCategory: string;
  selectedUnit: string;
  addFormControl = new FormControl();
  thresholdValue: number;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  onReset() {
    this.addFormControl.reset();
  }

  /* onCatInput(){
    if (isDefined(this.selectedCategory) && this.selectedCategory !== 'Groceries') {
      return true;
    } else {
      return false;
    }
  }*/

  onAdd() {
    const category = this.getCategory(this.selectedCategory);
    const dateCreated = this.dataService.getTimeStamp();
    const item: Item = {
      'itemId': '',
      'itemName': this.itemName.toLowerCase(),
      'itemQuantity': 0,
      'lastModified': dateCreated,
      'unit': this.selectedUnit,
      'category': category,
      'subCategory': this.selectedCategory,
      'addedBy': '',
      'thresholdValue': Number(this.thresholdValue)
    };

    if (item.itemName === undefined || this.selectedCategory === undefined || this.selectedUnit === undefined) {
      alert('fill all details');
      // TODO: add toast or alert here
    } else {
      this.dataService.addItem(item).then(() => {
        console.log('added item succesfully');
        // TODO: add toast or alert here
        this.router.navigate(['']);
      }).catch(err => {
        console.error('error adding item', err);
      });
    }


  }

  getCategory(selectedCategory) {
    let category: any;
    this.categoryGroups.forEach(element => {
      if (element.category.includes(selectedCategory)) {
        category = element.name;
      }
    });
    return category;
  }
}
