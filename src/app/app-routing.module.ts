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
import { ProjectsComponent } from './components/projects/projetcs/projects.component';
import { ItemDetailsPComponent } from './components/projects/item-details-p/item-details-p.component';
import { LoginComponent } from './components/common/login/login.component';
import { AccesscontrolComponent } from './components/common/accesscontrol/accesscontrol.component';
import { SummaryReportComponent } from './components/common/summary-report/summary-report.component';
import { GoogleChartResolver } from './core/google-chart-resolver';
import { ItemReportComponent } from './components/common/item-report/item-report.component';
import { CanAccessGuard } from './core/can-access.guard';
import { PageunresponsiveComponent } from './components/common/pageunresponsive/pageunresponsive.component';
import { SubCategoryLevelReportComponent } from './components/common/sub-category-level-report/sub-category-level-report.component';
import { CategoryLevelReportComponent } from './components/common/category-level-report/category-level-report.component';
import { ReimbursementComponent } from './components/common/reimbursement/reimbursement/reimbursement.component';
import { StudentDetailsComponent } from './components/common/student-details/student-details/student-details.component';
import { FolderViewComponent } from './components/common/student-details/folder-view/folder-view.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'HomeSchoolInventory',
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
    path: 'Projects',
    component: ProjectsComponent,
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
    canActivate: [CanAccessGuard]
  },
  {
    path: 'Reimbursement',
    component: ReimbursementComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'Student Details',
    component: StudentDetailsComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'add',
    component: AddNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item-details-hs/:id',
    component: ItemDetailsComponent,
    resolve: { google: GoogleChartResolver },
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
    path: 'item-details-p/:id',
    component: ItemDetailsPComponent,
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
    path: 'Summary-level',
    component: SummaryReportComponent,
    resolve: { google: GoogleChartResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'Category-level',
    component: CategoryLevelReportComponent,
    resolve: { google: GoogleChartResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'SubCategory-level',
    component: SubCategoryLevelReportComponent,
    resolve: { google: GoogleChartResolver },
    canActivate: [AuthGuard]
  },
  {
    path: 'student-folder/:id',
    component: FolderViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageunresponsiveComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
