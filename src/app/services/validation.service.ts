import { FirebaseService } from './firebase.service';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static firebase: FirebaseService;

  constructor(private firebaseService: FirebaseService) {
      ValidationService.firebase = this.firebaseService;
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      required: 'Required',
      invalidText: 'Enter valid text',
      invalidPattern: `Enter valid ${validatorValue}`,
      invalidlength: `${validatorValue.label} length is ${validatorValue.value}`,
      invalidMinlength: `${validatorValue.label} min length is ${validatorValue.value}`,
      invalidMaxlength: `${validatorValue.label} max length is ${validatorValue.value}`,
      invalidUniqueField: `This ${validatorValue} already exists`,
      invalidEmailAddress: 'Enter valid email address',
      min: 'Enter valid value',
      max: 'Enter valid value'      
    };
    return config[validatorName];
  }

  static required(minLength?: number, maxLength?: number, pattern?: string, notRequired?: boolean) {
    return (control: FormControl) => {
      if(control.value) {
        if(!notRequired){
          notRequired = false;
        }
        if(minLength && minLength == 0) {
          minLength = undefined;
        }
        if(maxLength && maxLength == 0) {
          maxLength = undefined;
        }
        if(pattern && pattern == "") {
          pattern = undefined;
        }
        let controlLabel = ValidationService.getControlLabel(ValidationService.getControlName(control));
        if(String(control.value).length < 1){
          if(!notRequired) {
            return { required: true };
          } else {return null;}
        } else if(String(control.value).trim().length < 1){
          return { invalidText: true };
        } else if (pattern && !String(control.value).match(pattern)) {
          return { invalidPattern: controlLabel };
        } else if (minLength && maxLength && minLength == maxLength) {
          if(String(control.value).trim().length != maxLength) {
            return { invalidlength: {label:controlLabel,value:maxLength} };
          } else {
            return null;
          }
        } else if (minLength && String(control.value).trim().length < minLength) {
          return { invalidMinlength: {label:controlLabel,value:minLength} };
        } else if (maxLength && String(control.value).trim().length > maxLength) {
          return { invalidMaxlength: {label:controlLabel,value:maxLength} };
        } else {
          return null;
        }
      } else {
        if(!notRequired) {
          return { required: true };
        } else {return null;}
      }
    }
  }

  static uniquenessValidator(fieldLengthThreshold: number) {
    return (control: FormControl) => {
      if(control.value && String(control.value).length == fieldLengthThreshold) {
        let controlName = ValidationService.getControlName(control);
        return ValidationService.firebase.fetchUsersbyField(controlName,String(control.value),"==").then((users) => {
          if(users && users.length > 0) {
            return { invalidUniqueField: ValidationService.getControlLabel(controlName) };
          } else {
            return null;
          }
        }, (err) => {
          return null;
        });
      } else {
        return new Promise<any>((resolve) => {
          resolve(null);
        });
      }
    }
  }

  static getControlName(control: FormControl): string {
    let controlName: string = "";
    if(control && control.parent && control.parent.controls) {
      const formGroup = control.parent.controls;
      controlName = Object.keys(formGroup).find(name => control === formGroup[name]) || null;
    }
    return controlName;
  }

  static getControlLabel(controlName: string): string {
    let label: string = "";
    let labelArr = controlName.split(/(?=[A-Z])/);
    labelArr.forEach(element => {
      element = element ? element.charAt(0).toUpperCase() + element.substr(1).toLowerCase() : '';
      label = label + " " + element;
    });
    return label.trim();
  }

  static emailValidator(control: FormControl) {   
    if(control.value) {
      if (control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      ) {
        return null;
      } else {
        return { invalidEmailAddress: true };
      }
    }
  }
}
