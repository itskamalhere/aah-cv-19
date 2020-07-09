import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientListPageRoutingModule } from './patient-list-routing.module';

import { PatientListPage } from './patient-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PatientListPageRoutingModule
  ],
  declarations: [PatientListPage]
})
export class PatientListPageModule {}