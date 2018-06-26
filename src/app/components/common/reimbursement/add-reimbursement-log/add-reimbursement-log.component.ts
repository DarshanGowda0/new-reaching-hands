import { Component, OnInit, Inject } from '@angular/core';
import { ReimbursementLog } from '../../../../models/reimbursement-log';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../../../core/data-service.service';
import { ReimbursementComponent } from '../reimbursement/reimbursement.component';
import { AuthService } from '../../../../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-add-reimbursement-log',
  templateUrl: './add-reimbursement-log.component.html',
  styleUrls: ['./add-reimbursement-log.component.css']
})
export class AddReimbursementLogComponent implements OnInit {

  reimbursementLog: ReimbursementLog = {} as ReimbursementLog;
  reimbursementLog2: ReimbursementLog;
  logFormControl = new FormControl();
  constructor(public dialogRef: MatDialogRef<AddReimbursementLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, private auth: AuthService,
    private afAuth: AngularFireAuth) {
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
      'dateOfPurchase': this.reimbursementLog.dateOfPurchase,
      'itemName': this.reimbursementLog.itemName,
      'totalCost': this.reimbursementLog.totalCost,
      'billNumber': this.reimbursementLog.billNumber,
      'addedBy': this.dataService.uid,
      'status': 'open',
      'logdate': this.dataService.getTimeStamp(),
      'name': ''
    };
    console.log('check', tempItemLog);
    tempItemLog.name = this.afAuth.auth.currentUser.displayName;
    this.dataService.addReimbursementLog(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });

    this.dialogRef.close();
  }


}
