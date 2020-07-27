import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateFormatPipe, TimeFormatPipe, HighlightPipe, ControlMessages } from './format.pipe';

@NgModule({
  declarations: [DateFormatPipe, TimeFormatPipe, HighlightPipe, ControlMessages],
  imports: [CommonModule,IonicModule],
  exports: [DateFormatPipe, TimeFormatPipe, HighlightPipe, ControlMessages],
})

export class FormatPipeModule {}
