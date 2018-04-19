import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ItemLogP } from '../../../models/item-log';
import { DataService } from '../../../core/data-service.service';
import { Item } from '../../../models/item';


@Component({
  selector: 'app-add-log-p',
  templateUrl: './add-log-p.component.html',
  styleUrls: ['./add-log-p.component.css']
})
export class AddLogPComponent implements OnInit {

  itemLog1: ItemLogP = {} as ItemLogP;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common', 'Staff'];
  logTypeOptions = ['Paid', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLogPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog1) {
      this.itemLog1 = data.itemLog1;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLogP = {
      'logId': this.itemLog1.logId ? this.itemLog1.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'selectedCommons': this.itemLog1.selectedCommons,
      'cost': Number(this.itemLog1.cost),
      'remarks': this.itemLog1.remarks,
      'logType': this.itemLog1.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid,
      'servicer': this.itemLog1.servicer,
      'billNumber': this.itemLog1.billNumber,
      'serviceDate': this.itemLog1.serviceDate
    };
    console.log('check', tempItemLog);
    this.dataService.addLog1(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }

}
