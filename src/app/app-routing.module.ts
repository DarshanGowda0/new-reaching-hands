import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/auth.guard';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { AddNewComponent } from './components/common/add-new/add-new.component';
import { ItemDetailsComponent } from './components/inventory/item-details/item-details.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
