import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DataService } from './data-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { GoogleChartResolver } from './google-chart-resolver';
import { CanAccessGuard } from './can-access.guard';
import { MessagingService } from './messaging-service.service';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    DataService,
    GoogleChartResolver,
    AngularFireAuth,
    AngularFireDatabase,
    CanAccessGuard,
    MessagingService
  ]
})
export class CoreModule { }
