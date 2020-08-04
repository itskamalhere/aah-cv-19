import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PatientDetailsPageRoutingModule } from './patient-details-routing.module';
import { PatientDetailsPage } from './patient-details.page';
import { ChartsModule } from 'ng2-charts';
import { SharedDirectivesModule } from '../directives/shared-directives/shared-directives.module';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChartsModule,
    SharedDirectivesModule,
    FormatPipeModule,
    PatientDetailsPageRoutingModule
  ],
  declarations: [PatientDetailsPage]
})
export class PatientDetailsPageModule {}