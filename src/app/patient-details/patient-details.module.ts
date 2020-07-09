import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientDetailsPageRoutingModule } from './patient-details-routing.module';

import { PatientDetailsPage } from './patient-details.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    PatientDetailsPageRoutingModule
  ],
  declarations: [PatientDetailsPage]
})
export class PatientDetailsPageModule {}