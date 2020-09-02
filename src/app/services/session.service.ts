import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { User } from '../model/user-model';
import { BehaviorSubject } from 'rxjs';
import { Platform, ToastController } from "@ionic/angular";
import { Device } from '@capacitor/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import {Plugins, HapticsImpactStyle } from '@capacitor/core';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { FirebaseService } from './firebase.service';
import { SwUpdate } from "@angular/service-worker";

const { Haptics } = Plugins;

@Injectable()
export class SessionService implements OnInit, OnDestroy, CanActivate {
  hybrid: boolean;
  gcmToken: string;
  user: User;
  role: string;
  permissions: string[];
  formContext: FormContext;
  mobileNumber: string;
  passCode: string;
  deviceId: string;
  modalCalled: boolean = false;
  registrationSubject: BehaviorSubject<REGISTRATION> = new BehaviorSubject(REGISTRATION.NOT_STARTED);
  authenticationSubject: BehaviorSubject<AUTHENTICATION> = new BehaviorSubject(AUTHENTICATION.NOT_STARTED);

  constructor(
    private platform: Platform,
    private firebase: FirebaseX,
    private firebaseService: FirebaseService,
    private router: Router,
    private readonly updates: SwUpdate,
    private toastController: ToastController
    ) {
      if(this.platform.is("hybrid")) {
        this.hybrid = true;
      }
      this.platform.ready().then(() => {
        const me = this;
        if(this.hybrid) {
          this.setDeviceId();
          Haptics.selectionStart();
          setTimeout(function(){
            me.firebase.getToken().then(token => {
              me.gcmToken = token;
            });
          },2000)
        } else {
          this.updates.available.subscribe(event => {
            this.showUpdateAlert();
          });
        }
      });
    }

  ngOnInit() {}

  async showUpdateAlert() {
    const toast = await this.toastController.create({
      header: "New Version Available",
      position: "bottom",
      animated: true,
      color: "primary",
      buttons: [
        {
          text: "Update",
          role: "cancel",
          handler: () => {
            this.updates.activateUpdate().then(() => {
              document.location.reload();
            });
          }
        }
      ]
    });
    toast.present();
  }

  ngOnDestroy() {
    if(this.hybrid) {
      Haptics.selectionEnd();
    }
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let path = route.url[0].path;
    if(path == "login") {
      if (this.authenticationSubject.value == AUTHENTICATION.SUCCESS && this.user.data.userType == "Staff") {
        this.router.navigate(["home/patient-list"]);
        return false;
      } else if (this.authenticationSubject.value == AUTHENTICATION.SUCCESS && this.user.data.userType == "Patient") {
        this.router.navigate(['home/patient-details']);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  vibrate(effect: EFFECT) {
    if(effect == EFFECT.KEY_PRESS) {
      if(this.hybrid) {
        Haptics.selectionChanged();
      } else if("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } else if(effect == EFFECT.MEDIUM) {
      if(this.hybrid) {
        Haptics.impact({style: HapticsImpactStyle.Medium});
        Haptics.vibrate();
      } else if("vibrate" in navigator) {
        navigator.vibrate(300);
      }
    }
  }

  setFormContext(formContext: FormContext) {
    this.formContext = formContext;
  }

  getFormContext() {
    return this.formContext;
  }

  async setDeviceId() {
    const info = await Device.getInfo();
    this.deviceId = info.uuid;
  }

  getFirebaseService() {
    return this.firebaseService;
  }

  getDeviceId() {
    return this.deviceId;
  }

  isHybrid() {
    return this.hybrid;
  }

  getGcmToken(): string {
    return this.gcmToken;
  }

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

  setModalCalled(modalCalled: boolean) {
    this.modalCalled = modalCalled;
  }

  isModalCalled() {    
    return this.modalCalled;
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

export enum EFFECT {
  KEY_PRESS = 0,
  MEDIUM = 1
}

export interface FormContext {
  user: User;
  userType: FORM_USER;
  action: FORM_ACTION;  
  modalName: FORM_MODAL;
  modalAction: MODAL_ACTION;
}

export enum FORM_ACTION {
  ADD = "Add",
  EDIT = "Edit"
}

export enum FORM_USER {
  STAFF = "Staff",
  PATIENT = "Patient"
}

export enum FORM_MODAL {
  VITAL = "Vital",
  IMAGE = "Image"
}

export enum MODAL_ACTION {
  ADD = "Add",
  EDIT = "Edit"
}