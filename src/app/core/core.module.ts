import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DataService } from './data-service.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ],
  declarations: [],
  providers: [AuthService, AuthGuard, DataService]
})
export class CoreModule { }
