import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPermissionsDirective, ValueChangeDirective } from '../custom.directive';

@NgModule({
  declarations: [HasPermissionsDirective, ValueChangeDirective],
  imports: [
    CommonModule
  ],
  exports: [HasPermissionsDirective, ValueChangeDirective]
})
export class SharedDirectivesModule { }
