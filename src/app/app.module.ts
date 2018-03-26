import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { AddNewComponent } from './components/common/add-new/add-new.component';
import { SubCatListingComponent } from './components/inventory/sub-cat-listing/sub-cat-listing.component';
import { ItemDetailsComponent } from './components/inventory/item-details/item-details.component';
import { AddLogComponent } from './components/inventory/add-log/add-log.component';
import { ItemDetails1Component } from './components/maintenance/item-details1/item-details1.component';
import { SubCatListing1Component } from './components/maintenance/sub-cat-listing1/sub-cat-listing1.component';
import { AddLog1Component } from './components/maintenance/add-log1/add-log1.component';
import { MaintenanceComponent } from './components/maintenance/maintenance/maintenance.component';
import { EducationComponent } from './components/education/education/education.component';
import { AddLog2Component } from './components/education/add-log2/add-log2.component';
import { ItemDetails2Component } from './components/education/item-details2/item-details2.component';
import { SubCatListing2Component } from './components/education/sub-cat-listing2/sub-cat-listing2.component';
import { SubCatListing3Component } from './components/services/sub-cat-listing3/sub-cat-listing3.component';
import { ServicesComponent } from './components/services/services/services.component';
import { AddLog3Component } from './components/services/add-log3/add-log3.component';
import { ItemDetails3Component } from './components/services/item-details3/item-details3.component';
import { LoginComponent } from './components/common/login/login.component';
import { AccesscontrolComponent } from './components/common/accesscontrol/accesscontrol.component';

import { ItemReportComponent } from './components/common/item-report/item-report.component';

import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PageunresponsiveComponent } from './components/common/pageunresponsive/pageunresponsive.component';
import { SummaryReportComponent} from './components/common/summary-report/summary-report.component';
import { CategoryLevelReportComponent } from './components/common/category-level-report/category-level-report.component';
import { SubCategoryLevelReportComponent } from './components/common/sub-category-level-report/sub-category-level-report.component';


@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    AddNewComponent,
    SubCatListingComponent,
    ItemDetailsComponent,
    AddLogComponent,
    ItemDetails1Component,
    SubCatListing1Component,
    AddLog1Component,
    MaintenanceComponent,
    EducationComponent,
    AddLog2Component,
    ItemDetails2Component,
    SubCatListing2Component,
    SubCatListing3Component,
    ServicesComponent,
    AddLog3Component,
    ItemDetails3Component,
    LoginComponent,
    AccesscontrolComponent,
    ItemReportComponent,
    PageunresponsiveComponent,
    SummaryReportComponent,
    CategoryLevelReportComponent,
    SubCategoryLevelReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    MatCheckboxModule
  ],
  providers: [{provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}],
  bootstrap: [AppComponent],
  entryComponents: [
    AddLogComponent,
    AddLog1Component,
    AddLog2Component,
    AddLog3Component,
    AccesscontrolComponent
  ]
})
export class AppModule { }
