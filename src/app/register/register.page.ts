import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,  
  ViewChild,  
  TemplateRef,  
} from "@angular/core";
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { FirebaseService } from '../services/firebase.service';
import { SessionService, REGISTRATION } from "../services/session.service";
import { User, UserData } from "../model/user-model";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Device } from '@capacitor/core';
import { Platform } from "@ionic/angular";
import { AppPreferences } from "@ionic-native/app-preferences/ngx";
import {Plugins, HapticsImpactStyle } from '@capacitor/core';

const { Haptics } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(100%)'}) ),
      state('*', style({ transform: 'translateX(0%)' }) ),
      transition('void => *', [animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))]),
      transition('* => void', [animate('0.3s ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})

export class RegisterPage implements OnInit, OnDestroy, AfterViewInit {
  statusHeader: string = "";
  statusLabel: string = "";
  mobileNumber: string;
  fsCredential;
  deviceId: string;
  gcmToken: string;
  numbers: number[] = [1,2,3,4,5,6,7,8,9];
  zero: number = 0;
  setCode: string;
  confirmCode: string;  
  @ViewChild("statusTemplate") private statusTemplate: TemplateRef<object>;
  @ViewChild("registerTemplate") private registerTemplate: TemplateRef<object>;
  @ViewChild("otpTemplate") private otpTemplate: TemplateRef<object>;
  @ViewChild("passcodeTemplate") private passcodeTemplate: TemplateRef<object>;
  viewTemplate: TemplateRef<object>;
  databaseSub: Subscription;
  otpSub: Subscription;
  passcodeSub: Subscription;
  databaseSubject: BehaviorSubject<DATABASE_VERIFICATION> = new BehaviorSubject(DATABASE_VERIFICATION.NOT_STARTED);
  otpSubject: BehaviorSubject<OTP_VERIFICATION> = new BehaviorSubject(OTP_VERIFICATION.NOT_STARTED);
  passcodeSubject: BehaviorSubject<PASSCODE_SETTING> = new BehaviorSubject(PASSCODE_SETTING.NOT_STARTED);

  constructor(
    private firebase: FirebaseX,
    private firebaseService: FirebaseService,
    private session: SessionService,
    private platform: Platform,
    private appPreferences: AppPreferences
    ) {}

  ngOnInit() {

    this.getDeviceId();
    Haptics.selectionStart();

    this.databaseSub =  this.databaseSubject.subscribe((status) => {
      if (status == DATABASE_VERIFICATION.PENDING) {
        this.statusHeader = "Register using mobile number";
        this.statusLabel = "";
        this.viewTemplate = this.registerTemplate;
      } else if (status == DATABASE_VERIFICATION.SUCCESS) {        
        this.statusLabel = "database verification success";
        this.viewTemplate = this.statusTemplate;
        this.otpSubject.next(OTP_VERIFICATION.PENDING);
        //this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
      } else if (status == DATABASE_VERIFICATION.FAILED) {
        this.statusHeader = "Registration Failed";
        this.statusLabel = "No record available for the entered number\nPlease contact hospital for more information";
      }
    });

    this.otpSub = this.otpSubject.subscribe((status) => {
      if (status == OTP_VERIFICATION.PENDING) {
        this.statusLabel = "sending OTP to mobile";
        this.sendOTP();
      } else if (status == OTP_VERIFICATION.SUCCESS) {
        this.statusLabel = "OTP verification success";
        this.viewTemplate = this.statusTemplate;
        this.updateUserDetails();        
      } else if (status == OTP_VERIFICATION.FAILED) {
        this.statusHeader = "OTP Verification Failed";        
      }
    });

    this.passcodeSub = this.passcodeSubject.subscribe((status) => {
      if (status == PASSCODE_SETTING.PENDING) {
        this.setCode = "";
        this.confirmCode = "";
        this.statusHeader = "Set Passcode";
        this.statusLabel = "checkmark";
        this.viewTemplate = this.passcodeTemplate;
      } else if (status == PASSCODE_SETTING.SET) {
        this.statusHeader = "Confirm Passcode";
        this.statusLabel = "checkmark-done";
        this.viewTemplate = this.passcodeTemplate;
      } else if (status == PASSCODE_SETTING.CONFIRMED) {
        this.statusHeader = "";
        this.statusLabel = "";
        this.writeAppData();        
      }
    });

    this.firebase.getToken().then(token => {
      this.gcmToken = token;
    });

  }

  async getDeviceId(){
    const info = await Device.getInfo();
    this.deviceId = info.uuid;
  }

  verifyMobileNoinDB() {
    const me = this;
    this.firebaseService.fetchUserbyNo(this.mobileNumber).then((users) => {      
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
            me.databaseSubject.next(DATABASE_VERIFICATION.SUCCESS);
          });
        } else {
          me.databaseSubject.next(DATABASE_VERIFICATION.FAILED);
        }
      } else {
        me.databaseSubject.next(DATABASE_VERIFICATION.FAILED);
      }
    }, (err) => {
      console.log("error: " + err);
      me.databaseSubject.next(DATABASE_VERIFICATION.FAILED);
    });
  }

  sendOTP() {
    const me = this;    
    var timeOutDuration = 60;
    this.firebase.verifyPhoneNumber(this.mobileNumber,timeOutDuration).then((credential) => {
      console.log("OTP sent");
      me.fsCredential = credential;
      if(credential.instantVerification){
        me.signInWithOTP("");
      }else {
        me.viewTemplate = me.otpTemplate;
        me.statusHeader = "Enter OTP";
        me.statusLabel = "awaiting OTP submission";
      }
    }, (err) => {
      console.log("OTP error: "+err);
      me.statusLabel = err;
      me.otpSubject.next(OTP_VERIFICATION.FAILED);
    });
  }

  signInWithOTP(otp: string) {
    const me = this;
    if(otp && otp.length > 0){
      this.fsCredential.code = otp;
    }    
    this.firebase.signInWithCredential(this.fsCredential).then(() => {
      console.log("OTP user verified");
      this.otpSubject.next(OTP_VERIFICATION.SUCCESS);
    }, (err) => {
      console.log("OTP user verification error: " + err);
      me.statusLabel = err;
      this.otpSubject.next(OTP_VERIFICATION.FAILED);      
    });
  }

  updateUserDetails() {
    const me = this;
    let record = {} as UserData;
    record.deviceId = this.deviceId;
    record.gcmToken = this.gcmToken;
    this.firebaseService.updateUser(this.session.getUser().id, record).then((res) => {
      console.log("updateUserDetails success");
      this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
    }, (err) => {
      console.log("updateUserDetails error: "+err);
      me.statusLabel = err;
      me.otpSubject.next(OTP_VERIFICATION.FAILED);
    });
  }

  writeAppData() {
    const me = this;
    this.appPreferences.remove("app-data");
    const appData = this.mobileNumber+","+"true"+","+this.confirmCode;
    this.appPreferences.store("app-data",appData).then((res) => {
      console.log("Appdata write success");
      me.session.setMobileNumber(me.mobileNumber);
      me.session.setPassCode(me.confirmCode);
      this.session.registrationSubject.next(REGISTRATION.COMPLETED);
    },function(err) {
      console.log("error: " + err);
      me.statusHeader = err;
    });
  }

  vibrate(hapticStyle: HapticsImpactStyle) {
    Haptics.impact({style: hapticStyle});
    Haptics.vibrate();    
  }

  add(value: string) {
    Haptics.selectionChanged();
    if(this.passcodeSubject.value == PASSCODE_SETTING.PENDING && this.setCode.length < 4) {
      this.setCode = this.setCode + value;
    } else if(this.passcodeSubject.value == PASSCODE_SETTING.SET && this.setCode.length == 4 && this.confirmCode.length < 4) {
      this.confirmCode = this.confirmCode + value;
    }
  }

  acceptCode() {
    Haptics.selectionChanged();
    if(this.setCode.length == 4 && this.passcodeSubject.value == PASSCODE_SETTING.PENDING) {
      this.passcodeSubject.next(PASSCODE_SETTING.SET);
    }else if(this.setCode.length == 4 && this.confirmCode.length == 4) {
      if(this.setCode == this.confirmCode) {
        console.log("match");
        this.passcodeSubject.next(PASSCODE_SETTING.CONFIRMED);
      }else {
        console.log("no match");
        this.vibrate(HapticsImpactStyle.Medium);
        this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
      }
    }    
  }

  deleteCode() {
    Haptics.selectionChanged();
    if(this.setCode.length > 0 && this.passcodeSubject.value == PASSCODE_SETTING.PENDING) {
      this.setCode = this.setCode.substring(0,this.setCode.length-1);
    }else if (this.confirmCode.length > 0 && this.passcodeSubject.value == PASSCODE_SETTING.SET) {
      this.confirmCode = this.confirmCode.substring(0,this.confirmCode.length-1);
    }
  }

  ngAfterViewInit() {
    this.databaseSubject.next(DATABASE_VERIFICATION.PENDING);
    //this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
  }

  ngOnDestroy() {
    Haptics.selectionEnd();
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    if (this.databaseSub) {
      this.databaseSub.unsubscribe();
    }
    if (this.otpSub) {
      this.otpSub.unsubscribe();
    }
    if(this.passcodeSub) {
      this.passcodeSub.unsubscribe();
    }
  }

}

enum DATABASE_VERIFICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3
}

enum OTP_VERIFICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3
}

enum PASSCODE_SETTING {
  NOT_STARTED = 0,
  PENDING = 1,
  SET = 2,
  CONFIRMED = 3
}