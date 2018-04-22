import { Component, OnInit, Inject } from '@angular/core';
import { ReimbursementLog } from '../../../../models/reimbursement-log';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../../../core/data-service.service';
import { ReimbursementLog2 } from '../../../../models/reimbursement-log';
import { ReimbursementComponent } from '../reimbursement/reimbursement.component';

@Component({
  selector: 'app-add-reimbursement-log',
  templateUrl: './add-reimbursement-log.component.html',
  styleUrls: ['./add-reimbursement-log.component.css']
})
export class AddReimbursementLogComponent implements OnInit {

  reimbursementLog: ReimbursementLog = {} as ReimbursementLog;
  reimbursementLog2: ReimbursementLog2;
  logFormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<AddReimbursementLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    this.reimbursementLog2 = data.item;
    if (data.reimbursementLog) {
      this.reimbursementLog = data.reimbursementLog;
    }
   }

  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: ReimbursementLog = {
      'reimburesmentId': this.reimbursementLog.reimburesmentId ? this.reimbursementLog.reimburesmentId : this.dataService.generateId(),
      'dateOfPurchase' : this.reimbursementLog.dateOfPurchase,
      'itemName': this.reimbursementLog.itemName,
      'totalCost': this.reimbursementLog.totalCost,
      'billNumber': this.reimbursementLog.billNumber,
      'addedBy': this.dataService.uid,
      'logdate': this.dataService.getTimeStamp()
    };
    console.log('check', tempItemLog);
    this.dataService.addReimbursementLog(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }


}
