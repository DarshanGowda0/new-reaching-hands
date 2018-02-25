import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ItemLog1 } from '../../../models/item-log';
import { DataService } from '../../../core/data-service.service';
import { Item } from '../../../models/item';


@Component({
  selector: 'app-add-log1',
  templateUrl: './add-log1.component.html',
  styleUrls: ['./add-log1.component.css']
})
export class AddLog1Component implements OnInit {

  itemLog: ItemLog1 = {} as ItemLog1;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common'];
  logTypeOptions = ['Added', 'Supplied', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLog1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog) {
      this.itemLog = data.itemLog;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLog1 = {
      'logId': this.itemLog.logId ? this.itemLog.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'quantity': this.itemLog.quantity,
      'selectedCommons': this.itemLog.selectedCommons,
      'cost': this.itemLog.cost,
      'remarks': this.itemLog.remarks,
      'logType': this.itemLog.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid,
      'name': this.itemLog.name,
      'servicer': this.itemLog.servicer,
      'billNumber': this.itemLog.billNumber,
      'serviceDate': this.itemLog.serviceDate
    };
    this.dataService.addLog(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }

}
