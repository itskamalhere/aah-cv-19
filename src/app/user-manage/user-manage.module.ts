import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserManagePageRoutingModule } from './user-manage-routing.module';
import { UserManagePage } from './user-manage.page';
import { FormatPipeModule } from '../format.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    IonicModule,
    FormatPipeModule,
    UserManagePageRoutingModule
  ],
  declarations: [UserManagePage]
})
export class UserManagePageModule {}
