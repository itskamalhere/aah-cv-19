import { DocumentReference } from '@angular/fire/firestore';
import { Validators } from '@angular/forms';

export interface User {
    id: string;
    ref: DocumentReference;
    data: UserData;
  }

export interface UserData {
    address: string;
    age: string;
    deviceId: string;
    disabled: boolean;
    email: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    firstName: string;
    gcmToken: string;
    lastName: string;
    mobileNumber: string;
    role: DocumentReference;
    roomNumber: string;
    sex: string;
    type: string;
    uhid: string;
    vitals: Vitals[];
  }

  export interface Vitals {
    bloodPressure: string;
    heartRate: number;
    spo2: number;
    temperature: number;
  }

  export const PatientModel = {
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(3)]],
    sex: ['', [Validators.required]],
    mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    emergencyContactName: ['', [Validators.required]],
    emergencyContactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    uhid: ['', [Validators.required]],
    roomNumber: ['', [Validators.required]],
    role:  ['', [Validators.required]],
    status: ['', [Validators.required]]
  }

  export interface FormContext {
    userType: string;
    action: string;
  }
