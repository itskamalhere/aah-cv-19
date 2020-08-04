import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateFormatPipe, TimeFormatPipe, AgeFormatPipe, HighlightPipe, ControlMessages } from './format.pipe';

@NgModule({
  declarations: [DateFormatPipe, TimeFormatPipe, AgeFormatPipe, HighlightPipe, ControlMessages],
  imports: [CommonModule,IonicModule],
  exports: [DateFormatPipe, TimeFormatPipe, AgeFormatPipe, HighlightPipe, ControlMessages],
})

export class FormatPipeModule {}
