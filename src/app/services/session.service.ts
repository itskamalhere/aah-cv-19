import { Injectable } from '@angular/core';
import { User } from '../model/user-model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SessionService {
  
  user: User;
  role: string;
  permissions: string[];
  mobileNumber: string;
  passCode: string;
  registrationSubject: BehaviorSubject<REGISTRATION> = new BehaviorSubject(REGISTRATION.NOT_STARTED);
  authenticationSubject: BehaviorSubject<AUTHENTICATION> = new BehaviorSubject(AUTHENTICATION.NOT_STARTED);

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  getUser(){
    return this.user;
  }

  setRole(role: string) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  setPermissions(permissions: string[]) {
    this.permissions = permissions;
  }

  getPermissions() {
    return this.permissions;
  } 

  setMobileNumber(mobileNumber: string) {
    this.mobileNumber = mobileNumber;
  }

  getMobileNumber() {
    return this.mobileNumber;
  }

  setPassCode(passCode: string) {
    this.passCode = passCode;
  }

  getPassCode() {
    return this.passCode;
  }

}

export enum REGISTRATION {
  NOT_STARTED = 0,
  CHECK = 1,
  COMPLETED = 2,
  NOT_COMPLETED = 3
}

export enum AUTHENTICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
  LOGGED_OUT = 4
}
