import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ItemLog2 } from '../../../models/item-log';
import { DataService } from '../../../core/data-service.service';
import { Item } from '../../../models/item';


@Component({
  selector: 'app-add-log2',
  templateUrl: './add-log2.component.html',
  styleUrls: ['./add-log2.component.css']
})
export class AddLog2Component implements OnInit {

  itemLog2: ItemLog2 = {} as ItemLog2;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common', 'HomeSchool'];
  logTypeOptions = ['Added', 'Supplied', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLog2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog2) {
      this.itemLog2 = data.itemLog2;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLog2 = {
      'logId': this.itemLog2.logId ? this.itemLog2.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'cost': Number(this.itemLog2.cost),
      'selectedCommons': this.itemLog2.selectedCommons,
      'remarks': this.itemLog2.remarks,
      'logType': this.itemLog2.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'studentName': this.itemLog2.studentName,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid,
      'billNumber': this.itemLog2.billNumber,
      'startDate': this.itemLog2.startDate,
      'endDate': this.itemLog2.endDate
    };
    console.log('check', tempItemLog);
    this.dataService.addLog2(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }

}
