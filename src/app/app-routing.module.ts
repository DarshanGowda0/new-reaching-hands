import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/auth.guard';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { AddNewComponent } from './components/common/add-new/add-new.component';
import { ItemDetailsComponent } from './components/inventory/item-details/item-details.component';
import { MaintenanceComponent } from './components/maintenance/maintenance/maintenance.component';
import { ItemDetails1Component } from './components/maintenance/item-details1/item-details1.component';
import { EducationComponent } from './components/education/education/education.component';
import { ServicesComponent } from './components/services/services/services.component';
import { ItemDetails3Component } from './components/services/item-details3/item-details3.component';
import { ItemDetails2Component } from './components/education/item-details2/item-details2.component';
import { LoginComponent } from './components/common/login/login.component';
import { AccesscontrolComponent } from './components/common/accesscontrol/accesscontrol.component';
import { GoogleChartResolver } from './core/google-chart-resolver';
import { ItemReportComponent } from './components/common/item-report/item-report.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Maintenance',
    component: MaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Services',
    component: ServicesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Education',
    component: EducationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'AccessControl',
    component: AccesscontrolComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: AddNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details/:id',
    component: ItemDetailsComponent,
    resolve: { google: GoogleChartResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details1/:id',
    component: ItemDetails1Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details2/:id',
    component: ItemDetails2Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details3/:id',
    component: ItemDetails3Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reports',
    component: ItemReportComponent,
    resolve: { google: GoogleChartResolver },
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
