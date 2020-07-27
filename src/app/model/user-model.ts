import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { ValidationService } from '../services/validation.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

export interface User {
    id: string;
    ref: DocumentReference;
    data: UserData;
}

export interface UserData {  
  firstName: string;
  lastName: string;
  dob: string; 
  gender: string;
  mobileNumber: string;
  emailAddress: string;
  homeAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  registrationDate: string;
  uhid: string;
  roomNumber: string;
  role: DocumentReference;
  assignedTo: string;
  status: string;
  userType: string;
  deviceId: string;  
  gcmToken: string;
  vitals: Vital[];
}

export interface Vital {
  temperature: string,
  heartRate: string;
  spo2: string,
  bpSystolic: string,
  bpDiastolic: string,
  note: string,
  submittedBy: string,
  submittedDate: string,
}

@Injectable({
  providedIn: 'root'
})
export class FormModel {  
  PatientModel = [];
  StaffModel = [];
  VitalModel = [];
  constructor(private validationService: ValidationService) {
    this.PatientModel =
    [
      {attrName: "firstName", attrLabel: "First Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "lastName", attrLabel: "Last Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "dob", attrLabel: "Date Of Birth", attrType: "date", attrMin: moment().subtract(100,'year').toISOString(), attrMax:  moment().toISOString(), attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "gender", attrLabel: "Gender", attrType: "select", attrOptions: ["Male","Female","Third Gender"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "mobileNumber", attrLabel: "Mobile Number", attrType: "tel", attrRequired: true, attrEditable: false, control: ['',[ValidationService.required(10,10,"^[0-9]*$")],ValidationService.uniquenessValidator(10)]},
      {attrName: "emailAddress", attrLabel: "Email Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(),ValidationService.emailValidator]]},
      {attrName: "homeAddress", attrLabel: "Home Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(15,0)]]},
      {attrName: "emergencyContactName", attrLabel: "Emergency Contact Name", attrType: "text", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"",true)]]},
      {attrName: "emergencyContactNumber", attrLabel: "Emergency Contact Number", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(10,10,"^[0-9]*$",true)]]},
      {attrName: "registrationDate", attrLabel: "Registration Date", attrType: "date", attrMin: moment().subtract(1,'year').toISOString(), attrMax:  moment().toISOString(), attrRequired: true, attrEditable: true, control: [moment().toISOString(), [ValidationService.required()]]},
      {attrName: "uhid", attrLabel: "UHID", attrType: "tel", attrRequired: true, attrEditable: false, control: ['', [ValidationService.required(11,11,"^[0-9]*$")],ValidationService.uniquenessValidator(11)]},
      {attrName: "roomNumber", attrLabel: "Room Number", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,0)]]},
      {attrName: "role", attrLabel: "Role", attrType: "lookup", attrSelection: "single", attrFnParams: {collection:"roles",query:"roleType|==|Patient",value:"id",label:"id",separator:","}, attrOptions:null, attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "assignedTo", attrLabel: "Assigned To", attrType: "lookup", attrSelection: "multiple", attrFnParams: {collection:"users",query:"userType|==|Staff",value:"id",label:"firstName,lastName",separator:" "}, attrOptions:null, attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "status", attrLabel: "Status", attrType: "select", attrOptions: ["Active","Inactive","Discharged"], attrRequired: true, attrEditable: true, control: ['Active', [ValidationService.required()]]},
      {attrName: "userType", attrLabel: "User Type", attrType: "select", attrOptions: ["Patient"], attrRequired: true, attrEditable: true, control: ['Patient', [ValidationService.required()]]}
    ];

    this.StaffModel =
    [
      {attrName: "firstName", attrLabel: "First Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "lastName", attrLabel: "Last Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "dob", attrLabel: "Date Of Birth", attrType: "date", attrMin: moment().subtract(100,'year').toISOString(), attrMax: moment().toISOString(), attrRequired: false, attrEditable: true, control: ['', []]},
      {attrName: "gender", attrLabel: "Gender", attrType: "select", attrOptions: ["Male","Female","Third Gender"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "mobileNumber", attrLabel: "Mobile Number", attrType: "tel", attrRequired: true, attrEditable: false, control: ['',[ValidationService.required(10,10,"^[0-9]*$")],ValidationService.uniquenessValidator(10)]},
      {attrName: "emailAddress", attrLabel: "Email Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(),ValidationService.emailValidator]]},
      {attrName: "registrationDate", attrLabel: "Registration Date", attrType: "date", attrMin: moment().subtract(1,'year').toISOString(), attrMax: moment().toISOString(), attrRequired: true, attrEditable: true, control: [moment().toISOString(), [ValidationService.required()]]},      
      {attrName: "role", attrLabel: "Role", attrType: "lookup", attrSelection: "single", attrFnParams: {collection:"roles",query:"roleType|==|Staff",value:"id",label:"id",separator:","}, attrOptions:null, attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "status", attrLabel: "Status", attrType: "select", attrOptions: ["Active","Inactive"], attrRequired: true, attrEditable: true, control: ['Active', [ValidationService.required()]]},
      {attrName: "userType", attrLabel: "User Type", attrType: "select", attrOptions: ["Staff"], attrRequired: true, attrEditable: true, control: ['Staff', [ValidationService.required()]]}
    ];

    this.VitalModel =
    [
      {attrName: "temperature", attrLabel: "Temperature", attrType: "tel", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,5,"^[0-9]*$",true)]]},
      {attrName: "heartRate", attrLabel: "Heart Rate", attrType: "tel", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,3,"^[0-9]*$",true)]]},
      {attrName: "spo2", attrLabel: "SPO2", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,3,"^[0-9]*$",true)]]},
      {attrName: "bpSystolic", attrLabel: "BP Systolic (top)", attrType: "tel", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,3,"^[0-9]*$",true)]]},
      {attrName: "bpDiastolic", attrLabel: "BP Diastolic (bottom)", attrType: "tel", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(2,3,"^[0-9]*$",true)]]},
      {attrName: "note", attrLabel: "Notes", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]}
    ];    
   }
}
