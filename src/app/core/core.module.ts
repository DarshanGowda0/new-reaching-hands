import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DataService } from './data-service.service';
import { GoogleChartResolver } from './google-chart-resolver';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ],
  declarations: [],
  providers: [AuthService, AuthGuard, DataService, GoogleChartResolver]
})
export class CoreModule { }
