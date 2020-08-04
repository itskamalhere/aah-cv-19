import { PipeTransform, Pipe, Component, Input } from '@angular/core';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms'; 
import { ValidationService } from './services/validation.service';

@Pipe({
  name: 'dateformat'
})

export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {    
    return moment(value).format("DD MMM YYYY").toLocaleString();
  }
}

@Pipe({
  name: 'timeformat'
})

export class TimeFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {    
    return moment(value).format("DD MMM YYYY hh:mm:ss a").toLocaleString();
  }
}

@Pipe({
  name: 'ageformat'
})

export class AgeFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {        
    return moment().diff(value, "years");
  }
}

@Pipe({
  name: 'highlight'
})

export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: any, args: any): any {
    if(!args) {
      return value;
    }
    if(!value) {
      return value;
    }
    const re = new RegExp(args, 'gi');
    const match = value.match(re);
    if(!match) {
      return value;
    }
    const result = value.replace(re, "<mark>" + match[0] + "</mark>");    
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null"><ion-note color="danger">{{ errorMessage }}</ion-note></div>`
})
export class ControlMessages {  
  @Input() control: FormControl;
  constructor() {}

  get errorMessage() {
    for (let propertyName in this.control.errors) {      
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
         return ValidationService.getValidatorErrorMessage(propertyName,this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
