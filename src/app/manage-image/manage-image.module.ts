import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManageImagePageRoutingModule } from './manage-image-routing.module';
import { ManageImagePage } from './manage-image.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    ManageImagePageRoutingModule
  ],
  declarations: [ManageImagePage]
})
export class ManageImagePageModule {}
