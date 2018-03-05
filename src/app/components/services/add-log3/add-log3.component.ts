import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ItemLog3 } from '../../../models/item-log';
import { DataService } from '../../../core/data-service.service';
import { Item } from '../../../models/item';


@Component({
  selector: 'app-add-log3',
  templateUrl: './add-log3.component.html',
  styleUrls: ['./add-log3.component.css']
})
export class AddLog3Component implements OnInit {

  itemLog3: ItemLog3 = {} as ItemLog3;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common', 'HomeSchool'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLog3Component>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog3) {
      this.itemLog3 = data.itemLog3;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLog3 = {
      'logId': this.itemLog3.logId ? this.itemLog3.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'cost': Number(this.itemLog3.cost),
      'selectedCommons': this.itemLog3.selectedCommons,
      'remarks': this.itemLog3.remarks,
      'logType': this.itemLog3.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid,
      'servicer': this.itemLog3.servicer,
      'billNumber': this.itemLog3.billNumber,
      'serviceDate': this.itemLog3.serviceDate
    };
    console.log('check', tempItemLog);
    this.dataService.addLog3(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }

}
