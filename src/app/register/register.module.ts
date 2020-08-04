import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { SharedDirectivesModule } from '../directives/shared-directives/shared-directives.module';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    SharedDirectivesModule,
    FormatPipeModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
