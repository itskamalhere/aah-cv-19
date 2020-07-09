import { Component, OnInit, OnDestroy, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { SessionService, AUTHENTICATION } from "../services/session.service";
import { FirebaseService } from '../services/firebase.service';
import { Device } from '@capacitor/core';
import {Plugins, HapticsImpactStyle } from '@capacitor/core';
import { User } from '../model/user-model';

const { Haptics } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  statusHeader: string = "";
  statusLabel: string = "";
  biometricSub: Subscription;
  userSub: Subscription;
  numbers: number[] = [1,2,3,4,5,6,7,8,9];
  zero: number = 0;
  passCode: string;
  deviceId: string;
  @ViewChild("statusTemplate") private statusTemplate: TemplateRef<object>;
  @ViewChild("passcodeTemplate") private passcodeTemplate: TemplateRef<object>;
  viewTemplate: TemplateRef<object>;
  biometricSubject: BehaviorSubject<BIOMETRIC_VERIFICATION> = new BehaviorSubject(BIOMETRIC_VERIFICATION.NOT_STARTED);
  userSubject: BehaviorSubject<USER_VERIFICATION> = new BehaviorSubject(USER_VERIFICATION.NOT_STARTED);

  constructor(
    private biometric: FingerprintAIO,
    private session: SessionService,
    private firebaseService: FirebaseService
    ) { }

  ngOnInit() {
    
    this.getDeviceId();
    Haptics.selectionStart();

    this.biometricSubject.subscribe((status) => {
      if (status == BIOMETRIC_VERIFICATION.PENDING) {
        this.passCode = "";
        this.statusHeader = "Pending Authentication";
        this.statusLabel = "pending biometric verification";
        this.viewTemplate = this.statusTemplate;
        this.doAuthentication();
      } else if (status == BIOMETRIC_VERIFICATION.SUCCESS) {
        this.userSubject.next(USER_VERIFICATION.PENDING);
      } else if (status == BIOMETRIC_VERIFICATION.FAILED) {
        this.passCode = "";
        this.statusHeader = "Enter Passcode"
        this.statusLabel = "";
        this.viewTemplate = this.passcodeTemplate;
      }
    });

    this.userSubject.subscribe((status) => {
      if (status == USER_VERIFICATION.PENDING) {
        this.statusLabel = "pending user verification";
        this.verifyUserDevice();
      } else if (status == USER_VERIFICATION.SUCCESS) {
        this.statusHeader = "Authentication Success";
        this.statusLabel = "fetching data";
        this.session.authenticationSubject.next(AUTHENTICATION.SUCCESS);
      } else if (status == USER_VERIFICATION.FAILED) {
        this.statusHeader = "Authentication Failed";
        this.statusLabel = "This device is not authorised to use this application\nPlease uninstall and try registering again";
        this.viewTemplate = this.statusTemplate;
      }
    });

  }

  async getDeviceId(){
    const info = await Device.getInfo();
    this.deviceId = info.uuid;
  }

  async doAuthentication() {
    const me = this;
    try{        
        this.biometric.isAvailable().then(function(result) {
            me.biometric.show({
                title: 'Biometric Authentication',
                description: 'Continue with biometric authentication',
                fallbackButtonTitle: 'Use Backup',
                disableBackup:true
            })
            .then((result: any) => {
                me.biometricSubject.next(BIOMETRIC_VERIFICATION.SUCCESS);
            })
            .catch((error: any) => {
                me.statusLabel = error.message==undefined?error:error.message;
                me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
            });
        },function(error) {
            me.statusLabel = error.message==undefined?error:error.message;
            if(error && (Number(error.code) == me.biometric.BIOMETRIC_NOT_ENROLLED) || (Number(error.code) == me.biometric.BIOMETRIC_SCREEN_GUARD_UNSECURED)){                    
                me.statusLabel = "Enable biometric authentication in this device to proceed";
            }
            me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);            
        });
    }catch(error) {
        me.statusLabel = error.message==undefined?error:error.message;
        me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
    }
}

verifyUserDevice() {
  const me = this;
  this.firebaseService.fetchUserbyNo(this.session.getMobileNumber()).then((users) => {
    if(users && users.length > 0) {
      let user = {} as User;
      user.id = [...users][0].id;
      user.ref = [...users][0].ref;
      user.data =[...users][0].data;
      me.session.setUser(user);
      let role = user.data.role;
      if(role){
        role.get().then((role) => {
          me.session.setPermissions(role.data().permissions);
          me.userSubject.next(USER_VERIFICATION.SUCCESS);
        });
      } else {
        me.userSubject.next(USER_VERIFICATION.FAILED);
      }
    } else {
      me.userSubject.next(USER_VERIFICATION.FAILED);
    }
  }, (err) => {
    console.log("error: " + err);
    me.statusLabel = err;
    me.userSubject.next(USER_VERIFICATION.FAILED);
  });
}

vibrate(hapticStyle: HapticsImpactStyle) {
  Haptics.impact({style: hapticStyle});
  Haptics.vibrate();    
}

add(value: string) {
  Haptics.selectionChanged();
  if(this.passCode.length < 4) {
    this.passCode = this.passCode + value;
  }
  if(this.passCode.length == 4) {
    this.acceptCode();
  }
}

acceptCode() {
  Haptics.selectionChanged();
  let confirmCode = this.session.getPassCode();
  if(this.passCode == confirmCode) {
    this.userSubject.next(USER_VERIFICATION.PENDING);
    this.biometricSubject.next(BIOMETRIC_VERIFICATION.SUCCESS);
  }else {
    console.log("no match");
    this.passCode = "";
    //shake effect
    this.vibrate(HapticsImpactStyle.Medium);
  }
}

deleteCode() {
  Haptics.selectionChanged();
  if(this.passCode.length > 0) {
    this.passCode = this.passCode.substring(0,this.passCode.length-1);
  }
}

ngAfterViewInit() {
  this.biometricSubject.next(BIOMETRIC_VERIFICATION.PENDING);
}

ngOnDestroy() {
  Haptics.selectionEnd();
  this.unsubscribeAll();
}

private unsubscribeAll() {
  if (this.biometricSub) {
    this.biometricSub.unsubscribe();
  }
  if (this.userSub) {
    this.userSub.unsubscribe();
  }    
}

}

enum BIOMETRIC_VERIFICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3
}

enum USER_VERIFICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3
}