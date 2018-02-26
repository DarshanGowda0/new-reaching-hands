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
import { ItemReportComponent } from './components/common/item-report/item-report.component';

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
    ItemReportComponent
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
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddLogComponent
  ]
})
export class AppModule { }
