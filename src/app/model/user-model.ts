import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { ValidationService } from '../services/validation.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Validators } from '@angular/forms';

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
  bloodType: string;
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
  creationDate: any;
  modifyDate: any;
  vitals: Vital[];
}

export interface Vital {
  temperature: string;
  heartRate: string;
  spo2: string;
  respiration: string;
  bloodSugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  note: string;
  submittedBy: string;
  submittedDate: string;
}

export interface Conversation {
  id: string;
  ref: DocumentReference;
  data: ConvData;  
}

export interface ConvData {
  conversations: Conv[];
}

export interface Conv {
  message: string;
  attachmentName: string;
  attachmentUrl: string;
  attachmentContentType: string;
  convType: string;
  creatorId: string;
  creatorName: string;
  creatorType: string;
  creationDate: any;
  modifyDate: any;
}

export interface File {
  name: string;
  userId: string;  
  data: string;
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormModel {  
  PatientModel = [];
  StaffModel = [];
  VitalModel = [];
  RoleModel = [];
  constructor() {
    this.PatientModel =
    [
      {attrName: "firstName", attrLabel: "First Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "lastName", attrLabel: "Last Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "dob", attrLabel: "Date Of Birth", attrType: "date", attrMin: moment().subtract(100,'year').toISOString(true), attrMax:  moment().toISOString(true), attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "gender", attrLabel: "Gender", attrType: "select", attrSelection: "single", attrOptions: ["Male","Female","Third Gender"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "bloodType", attrLabel: "Blood Type", attrType: "select", attrSelection: "single", attrOptions: ["A+","A-","B+","B-","O+","O-","AB+","AB-"], attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"",true)]]},
      {attrName: "mobileNumber", attrLabel: "Mobile Number", attrType: "tel", attrRequired: true, attrEditable: false, control: ['',[ValidationService.required(10,10,"^[0-9]*$")],ValidationService.uniquenessValidator(10)]},
      {attrName: "emailAddress", attrLabel: "Email Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(),ValidationService.emailValidator]]},
      {attrName: "homeAddress", attrLabel: "Home Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(15,0)]]},
      {attrName: "emergencyContactName", attrLabel: "Emergency Contact Name", attrType: "text", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"",true)]]},
      {attrName: "emergencyContactNumber", attrLabel: "Emergency Contact Number", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(10,10,"^[0-9]*$",true)]]},
      {attrName: "registrationDate", attrLabel: "Registration Date", attrType: "date", attrMin: moment().subtract(1,'year').toISOString(true), attrMax:  moment().toISOString(true), attrRequired: true, attrEditable: true, control: [moment().toISOString(true), [ValidationService.required()]]},
      {attrName: "uhid", attrLabel: "UHID", attrType: "tel", attrRequired: true, attrEditable: false, control: ['', [ValidationService.required(11,11,"^[0-9]*$")],ValidationService.uniquenessValidator(11)]},
      {attrName: "roomNumber", attrLabel: "Room Number", attrType: "text", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(2,0,"",true)]]},
      {attrName: "role", attrLabel: "Role", attrType: "lookup", attrSelection: "single", attrFnParams: {collection:"roles",query:"roleType|==|Patient",value:"id",label:"id",separator:","}, attrOptions:null, attrRequired: true, attrEditable: true, control: [[ValidationService.required()]]},
      {attrName: "assignedTo", attrLabel: "Assigned To", attrType: "lookup", attrSelection: "multiple", attrFnParams: {collection:"users",query:"userType|==|Staff",value:"id",label:"firstName,lastName",separator:" "}, attrOptions:null, attrRequired: true, attrEditable: true, control: [[ValidationService.required()]]},
      {attrName: "status", attrLabel: "Status", attrType: "select", attrSelection: "single", attrOptions: ["Active","Inactive","Discharged"], attrRequired: true, attrEditable: true, control: ['Active', [ValidationService.required()]]},
      {attrName: "userType", attrLabel: "User Type", attrType: "select", attrSelection: "single", attrOptions: ["Patient"], attrRequired: true, attrEditable: true, control: ['Patient', [ValidationService.required()]]}
    ];

    this.StaffModel =
    [
      {attrName: "firstName", attrLabel: "First Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "lastName", attrLabel: "Last Name", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "dob", attrLabel: "Date Of Birth", attrType: "date", attrMin: moment().subtract(100,'year').toISOString(true), attrMax: moment().toISOString(true), attrRequired: false, attrEditable: true, control: ['', []]},
      {attrName: "gender", attrLabel: "Gender", attrType: "select", attrSelection: "single", attrOptions: ["Male","Female","Third Gender"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "mobileNumber", attrLabel: "Mobile Number", attrType: "tel", attrRequired: true, attrEditable: false, control: ['',[ValidationService.required(10,10,"^[0-9]*$")],ValidationService.uniquenessValidator(10)]},
      {attrName: "emailAddress", attrLabel: "Email Address", attrType: "text", attrRequired: true, attrEditable: true, control: ['', [ValidationService.required(),ValidationService.emailValidator]]},
      {attrName: "registrationDate", attrLabel: "Registration Date", attrType: "date", attrMin: moment().subtract(1,'year').toISOString(true), attrMax: moment().toISOString(true), attrRequired: true, attrEditable: true, control: [moment().toISOString(true), [ValidationService.required()]]},      
      {attrName: "role", attrLabel: "Role", attrType: "lookup", attrSelection: "single", attrFnParams: {collection:"roles",query:"roleType|==|Staff",value:"id",label:"id",separator:","}, attrOptions:null, attrRequired: true, attrEditable: true, control: [[ValidationService.required()]]},
      {attrName: "status", attrLabel: "Status", attrType: "select", attrSelection: "single", attrOptions: ["Active","Inactive"], attrRequired: true, attrEditable: true, control: ['Active', [ValidationService.required()]]},
      {attrName: "userType", attrLabel: "User Type", attrType: "select", attrSelection: "single", attrOptions: ["Staff"], attrRequired: true, attrEditable: true, control: ['Staff', [ValidationService.required()]]}
    ];

    this.VitalModel =
    [
      {attrName: "temperature", attrLabel: "Temperature (90-110) °F", attrIcon: "thermometer-outline", attrType: "decimal", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9.]*$",true),Validators.min(90),Validators.max(110)]]},
      {attrName: "spo2", attrLabel: "SPO2 (60-100)",attrIcon: "flower-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(60),Validators.max(100)]]},      
      {attrName: "heartRate", attrLabel: "Heart Rate (30-200)", attrIcon: "heart-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(30),Validators.max(200)]]},
      {attrName: "respiration", attrLabel: "Breath Rate (12-60) rpm",attrIcon: "lungs-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(12),Validators.max(60)]]},      
      {attrName: "bpSystolic", attrLabel: "BP Systolic ↑ (90-250)", attrIcon: "analytics-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(90),Validators.max(250)]]},      
      {attrName: "bpDiastolic", attrLabel: "BP Diastolic ↓ (60-140)", attrIcon: "analytics-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(60),Validators.max(140)]]},
      {attrName: "bloodSugar", attrLabel: "Blood Sugar (50-1000) mg/dL",attrIcon: "water-outline", attrType: "tel", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"^[0-9]*$",true),Validators.min(50),Validators.max(1000)]]},
      {attrName: "note", attrLabel: "Notes", attrIcon: "document-text-outline", attrType: "textarea", attrRequired: false, attrEditable: true, control: ['', [ValidationService.required(0,0,"",true)]]},      
      {attrName: "submittedDate", attrLabel: "Time", attrType: "date", attrMin: moment().subtract(2,'hour').toISOString(true), attrMax: moment().toISOString(true), attrRequired: false, attrEditable: false, control: [moment().toISOString(true), [ValidationService.required()]]}
    ];

    this.RoleModel =
    [
      {attrName: "permissions", attrLabel: "Permissions", attrType: "select", attrSelection: "multiple", attrOptions: ["patient-list","staff-list","can-view-all-users","can-add-user","can-add-vital","can-edit-patient","can-edit-staff"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]},
      {attrName: "roleType", attrLabel: "Role Type", attrType: "select", attrSelection: "single", attrOptions: ["Patient","Staff"], attrRequired: true, attrEditable: true, control: ['', [ValidationService.required()]]}
    ];
   }
}
