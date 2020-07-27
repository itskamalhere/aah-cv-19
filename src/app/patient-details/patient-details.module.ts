import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PatientDetailsPageRoutingModule } from './patient-details-routing.module';
import { PatientDetailsPage } from './patient-details.page';
import { ChartsModule } from 'ng2-charts';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChartsModule,
    FormatPipeModule,
    PatientDetailsPageRoutingModule
  ],
  declarations: [PatientDetailsPage]
})
export class PatientDetailsPageModule {}