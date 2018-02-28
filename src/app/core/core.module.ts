import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { AuthGuard } from './auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DataService } from './data-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth }     from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ],
  declarations: [],
  providers: [AuthService, NotificationService, AuthGuard, DataService, AngularFireDatabase, AngularFireAuth]
})
export class CoreModule { }
