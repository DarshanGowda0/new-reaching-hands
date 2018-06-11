import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../../../models/item';
import { DataService } from '../../../core/data-service.service';
import { Router } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  itemName: string ;
  selectedCategory: string ;
  selectedUnit: string ;
  thresholdValue: number;
  mainCategory: string ;
  subcategory: string[];
  addFlag: boolean;
  itemId = '';
  itemQuantity = 0;

  constructor(private dataService: DataService, private router: Router, public dialogRef: MatDialogRef<AddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initData(data);
  }

  ngOnInit() {
  }

  initData(data: any) {
    console.log(data);
    if (data.item) {
      const tempItem = data.item as Item;
      this.itemName = tempItem.itemName;
      this.selectedCategory = tempItem.subCategory;
      this.mainCategory = tempItem.category;
      this.selectedUnit = tempItem.unit;
      this.thresholdValue = tempItem.thresholdValue;
      this.itemId = tempItem.itemId;
      this.itemQuantity = tempItem.itemQuantity;
    } else {
      this.mainCategory = data.category;
      console.log('checkkkit', this.mainCategory);
    }
    this.getSubCategories();
  }
  getSubCategories() {
    this.categoryGroups.forEach(element => {
      if (element.name === this.mainCategory) {
        this.subcategory = element.category;
        console.log('this is ??', this.subcategory);
      }
    });
  }

  getmainCategory() {
    return this.mainCategory;
  }

  /* onCatInput(){
    if (isDefined(this.selectedCategory) && this.selectedCategory !== 'Groceries') {
      return true;
    } else {
      return false;
    }
  }*/

  onAdd() {
    const category = this.getmainCategory();
    const dateCreated = this.dataService.getTimeStamp();
    const item: Item = {
      'itemId': this.itemId,
      'itemName': this.itemName.toLowerCase(),
      'itemQuantity': this.itemQuantity,
      'lastModified': dateCreated,
      'unit': this.selectedUnit,
      'category': category,
      'subCategory': this.selectedCategory,
      'addedBy': '',
      'thresholdValue': Number(this.thresholdValue)
    };

    if (item.itemName === undefined || this.selectedCategory === undefined || this.selectedUnit === undefined) {
      alert('fill all details');
    } else {
      if ( this.itemId === '') {
        const a = this.dataService.getLogExists(item).subscribe(doc => {
          console.log(doc);
          if (doc.length > 0) {
            console.error('item already exists');
            alert('item already exists');
            a.unsubscribe();
          } else {
            this.dataService.addItem(item).then(() => {
              console.log('added item succesfully');
              alert(item.itemName + ' added successfully');
              this.router.navigate(['']);
            }).catch(err => {
              console.error('error adding item', err);
            });
            a.unsubscribe();
          }
        });
      } else {
        this.dataService.addItem(item).then(() => {
          console.log('edited item succesfully');
          alert(item.itemName + ' edited successfully');
          this.router.navigate(['']);
        }).catch(err => {
          console.error('error adding item', err);
        });
      }
    }
    this.dialogRef.close();
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
