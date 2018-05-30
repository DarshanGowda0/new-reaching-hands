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

  itemLogP: ItemLogP = {} as ItemLogP;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common', 'Staff'];
  logTypeOptions = ['Paid', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLogPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog1) {
      this.itemLogP = data.itemLog1;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLogP = {
      'logId': this.itemLogP.logId ? this.itemLogP.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'selectedCommons': this.itemLogP.selectedCommons,
      'cost': Number(this.itemLogP.cost),
      'remarks': this.itemLogP.remarks,
      'logType': this.itemLogP.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid,
      'servicer': this.itemLogP.servicer,
      'billNumber': this.itemLogP.billNumber,
      'serviceDate': this.itemLogP.serviceDate
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
