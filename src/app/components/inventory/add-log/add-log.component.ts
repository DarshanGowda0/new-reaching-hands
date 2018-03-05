import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ItemLog } from '../../../models/item-log';
import { DataService } from '../../../core/data-service.service';
import { Item } from '../../../models/item';



@Component({
  selector: 'app-add-log',
  templateUrl: './add-log.component.html',
  styleUrls: ['./add-log.component.css']
})
export class AddLogComponent implements OnInit {

  itemLog: ItemLog = {} as ItemLog;
  item: Item;
  logFormControl = new FormControl();

  commonsOptions = ['Boys', 'Girls', 'Common', 'HomeSchool'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];

  constructor(public dialogRef: MatDialogRef<AddLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.item = data.item;
    if (data.itemLog) {
      this.itemLog = data.itemLog;
    }
  }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ItemLog = {
      'logId': this.itemLog.logId ? this.itemLog.logId : this.dataService.generateId(),
      'date': this.dataService.getTimeStamp(),
      'quantity': Number(this.itemLog.quantity),
      'selectedCommons': this.itemLog.selectedCommons,
      'cost': Number(this.itemLog.cost),
      'remarks': this.itemLog.remarks,
      'logType': this.itemLog.logType,
      'category': this.item.category,
      'subCategory': this.item.subCategory,
      'itemId': this.item.itemId,
      'addedBy': this.dataService.uid
    };
    
    this.dataService.addLog(tempItemLog).then(() => {
      console.log('added log succesfully ', tempItemLog);
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }
}
