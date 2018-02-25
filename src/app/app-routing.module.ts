import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/auth.guard';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { AddNewComponent } from './components/common/add-new/add-new.component';
import { ItemDetailsComponent } from './components/inventory/item-details/item-details.component';
import { MaintenanceComponent } from './components/maintenance/maintenance/maintenance.component';
import { ItemDetails1Component } from './components/maintenance/item-details1/item-details1.component';

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
    path: 'add',
    component: AddNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details/:id',
    component: ItemDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details1/:id',
    component: ItemDetails1Component,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
