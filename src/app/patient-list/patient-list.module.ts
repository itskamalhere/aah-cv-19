import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PatientListPageRoutingModule } from './patient-list-routing.module';
import { PatientListPage } from './patient-list.page';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormatPipeModule,
    PatientListPageRoutingModule
  ],
  declarations: [PatientListPage]
})
export class PatientListPageModule {}