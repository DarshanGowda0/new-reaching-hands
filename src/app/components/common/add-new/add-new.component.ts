import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {

  categoryGroups = [
    {
      name: 'Inventory',
      category: [
        'Assets', 'Groceries', 'Stationary', 'Toiletries', 'Perishablegoods', 'Miscellaneous', 'Genericmeds'
      ]
    },
    {
      name: 'Services',
      category: [
        'Studentpersonalcare', 'Medicalcare', 'Transportation'
      ]
    },
    {
      name: 'Education',
      category: [
        'School', 'Extracurricular', 'Tutorials'
      ]
    },
    {
      name: 'Maintenance',
      category: [
        'Vehicle', 'Campus', 'Monthlybills'
      ]
    }
  ];

  Units = ['kgs', 'grams', 'litres', 'ml', 'numbers'];

  itemName: string;
  selectedCategory: string;
  selectedUnit: string;
  addFormControl = new FormControl();

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  onReset() {
    this.addFormControl.reset();
  }

  onAdd() {
    const category = this.getCategory(this.selectedCategory);
    const dateCreated = this.dataService.getTimeStamp();
    const item: Item = {
      'itemId': '',
      'itemName': this.itemName,
      'itemQuantity': 0,
      'lastModified': dateCreated,
      'unit': this.selectedUnit,
      'category': category,
      'subCategory': this.selectedCategory,
      'addedBy': ''
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
