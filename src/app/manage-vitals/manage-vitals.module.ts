import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManageVitalsPageRoutingModule } from './manage-vitals-routing.module';
import { ManageVitalsPage } from './manage-vitals.page';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    IonicModule,
    FormatPipeModule,
    ManageVitalsPageRoutingModule
  ],
  declarations: [ManageVitalsPage]
})
export class ManageVitalsPageModule {}
