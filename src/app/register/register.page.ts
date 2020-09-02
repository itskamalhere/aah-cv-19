import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,  
  ViewChild,  
  TemplateRef,  
} from "@angular/core";
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import 'firebase/auth';
import { SessionService, REGISTRATION, EFFECT } from "../services/session.service";
import { User, UserData } from "../model/user-model";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StorageMap } from "@ngx-pwa/local-storage";
import { AppPreferences } from "@ionic-native/app-preferences/ngx";
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first } from 'rxjs/operators';


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
  mobileForm: FormGroup;
  otpForm: FormGroup;
  statusHeader: string = "";
  statusLabel: string = "";
  mobileNumber: string;
  fsCredential;  
  numbers: string[] = ["1","2","3","4","5","6","7","8","9"];
  zero: string = "0";
  setCode: string = "";
  confirmCode: string = "";
  recaptchaVerifier;
  @ViewChild("statusTemplate") private statusTemplate: TemplateRef<object>;
  @ViewChild("registerTemplate") private registerTemplate: TemplateRef<object>;
  @ViewChild("otpTemplate") private otpTemplate: TemplateRef<object>;
  @ViewChild("passcodeTemplate") private passcodeTemplate: TemplateRef<object>;
  @ViewChild("registerCompleteTemplate") private registerCompleteTemplate: TemplateRef<object>;  
  viewTemplate: TemplateRef<object>;
  databaseSub: Subscription;
  otpSub: Subscription;
  passcodeSub: Subscription;
  databaseSubject: BehaviorSubject<DATABASE_VERIFICATION> = new BehaviorSubject(DATABASE_VERIFICATION.NOT_STARTED);
  otpSubject: BehaviorSubject<OTP_VERIFICATION> = new BehaviorSubject(OTP_VERIFICATION.NOT_STARTED);
  passcodeSubject: BehaviorSubject<PASSCODE_SETTING> = new BehaviorSubject(PASSCODE_SETTING.NOT_STARTED);

  constructor( 
    private formBuilder: FormBuilder,   
    private firebaseService: FirebaseService,
    public session: SessionService,    
    private appPreferences: AppPreferences,
    private storage: StorageMap,
    private auth: AngularFireAuth,
    private firebase: FirebaseX,
    private validationService: ValidationService,
    private loadingController: LoadingController,
    private functions: AngularFireFunctions
    ) {}

  ngOnInit() {

    this.initForm();

    this.otpSub = this.otpSubject.subscribe((status) => {
      if (status == OTP_VERIFICATION.PENDING) {
        this.statusHeader = "Register using mobile number";
        this.statusLabel = "";
        this.viewTemplate = this.registerTemplate;
      } else if (status == OTP_VERIFICATION.SUCCESS) {
        this.statusLabel = "OTP verification success";
        this.viewTemplate = this.statusTemplate;
        this.databaseSubject.next(DATABASE_VERIFICATION.PENDING);
      } else if (status == OTP_VERIFICATION.FAILED) {
        this.statusHeader = "OTP Verification Failed";
      }
    });
    
    this.databaseSub =  this.databaseSubject.subscribe((status) => {
      if (status == DATABASE_VERIFICATION.PENDING) {
        this.verifyMobileNoinDB();
      } else if (status == DATABASE_VERIFICATION.SUCCESS) {
        this.statusLabel = "database verification success";
        this.viewTemplate = this.statusTemplate;
        this.updateUserDetails();
      } else if (status == DATABASE_VERIFICATION.FAILED) {
        this.statusHeader = "Registration Failed";
        this.statusLabel = "No record available for the entered number\nPlease contact hospital for more information";
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
        this.writeAppData();
        this.statusHeader = "Registration Completed";
        this.statusLabel = "";        
        this.viewTemplate = this.registerCompleteTemplate;
      }
    });
  }

  async initForm() {
    this.mobileForm = this.formBuilder.group({
      mobileNumber: ['',[ValidationService.required(10,10,"^[0-9]*$")]]
    });
    this.otpForm = this.formBuilder.group({
      otp: ['',[ValidationService.required(6,6,"^[0-9]*$")]]
    });   
  }

  async verifyMobileNoinDB() {    
    const me = this;
    this.firebaseService.fetchUsersbyField("mobileNumber",this.mobileNumber,"==").then((users) => {
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

  async sendOTP(mobileNo: string) {
    const me = this;
    await this.presentLoading("Sending OTP...");
    this.mobileNumber = mobileNo;
    this.statusLabel = "sending OTP to mobile";
    if(this.session.isHybrid()) {
      var timeOutDuration = 60;
      this.firebase.verifyPhoneNumber("+91"+this.mobileNumber,timeOutDuration).then((credential) => {
        console.log("OTP sent");
        this.loadingController.dismiss();
        me.fsCredential = credential;
        me.viewTemplate = me.otpTemplate;
        me.statusHeader = "Enter OTP";
        me.statusLabel = "awaiting OTP submission";
        if(credential.instantVerification){
          console.log("Instant Verification");
          me.signInWithOTP("",true);
        }
      }, (err) => {
        console.log("OTP error: "+err);
        this.loadingController.dismiss();
        me.statusLabel = err;
        me.otpSubject.next(OTP_VERIFICATION.FAILED);
      });
    } else {
      this.auth.signInWithPhoneNumber("+91"+this.mobileNumber, this.recaptchaVerifier)
      .then((credential) => {       
        console.log("OTP sent");
        this.loadingController.dismiss();
        me.fsCredential = credential;
        me.viewTemplate = me.otpTemplate;
        me.statusHeader = "Enter OTP";
        me.statusLabel = "awaiting OTP submission";
      }).catch((err) => {
        console.log("OTP error: "+err);
        this.loadingController.dismiss();
        me.statusLabel = err;
        me.otpSubject.next(OTP_VERIFICATION.FAILED);
      });

    }
  }

  async signInWithOTP(otp: string,isInstant: boolean) {
    console.log(otp);
    const me = this;
    await this.presentLoading("Verifying OTP...");
    if(this.session.isHybrid() && !isInstant) {
      const credential = firebase.auth.PhoneAuthProvider.credential(this.fsCredential.verificationId, otp);
      this.auth.signInWithCredential(credential).then(() => {
        console.log("OTP user verified");
        this.loadingController.dismiss();
        this.otpSubject.next(OTP_VERIFICATION.SUCCESS);
      }, (err) => {
        console.log("OTP user verification error: " + err);
        this.loadingController.dismiss();
        me.statusLabel = err;
        this.otpSubject.next(OTP_VERIFICATION.FAILED);
      });
    } else if (this.session.isHybrid() && isInstant) {
      this.functions.httpsCallable("getCustomToken")({uid:this.mobileNumber}).pipe(first())
      .subscribe(resp => {
        this.auth.signInWithCustomToken(resp.message).then((cred) => {
          console.log("instant user verified using custom token");
          this.loadingController.dismiss();
          this.otpSubject.next(OTP_VERIFICATION.SUCCESS);
        }, (err) => {
          console.log("instant user verification error using custom token:"+err);
          this.loadingController.dismiss();
          me.statusLabel = err;
          this.otpSubject.next(OTP_VERIFICATION.FAILED);
        });
      }, err => {
        console.error({ err });
        this.loadingController.dismiss();
        me.statusLabel = err;
        this.otpSubject.next(OTP_VERIFICATION.FAILED);
      });
    } else {
      me.fsCredential.confirm(otp).then(() => {
        console.log("OTP user verified");
        this.loadingController.dismiss();
        this.otpSubject.next(OTP_VERIFICATION.SUCCESS);
      }, (err) => {
        console.log("OTP user verification error: " + err);
        this.loadingController.dismiss();
        me.statusLabel = err;
        this.otpSubject.next(OTP_VERIFICATION.FAILED);
      });
    }
  }

  updateUserDetails() {
    const me = this;
    if(this.session.isHybrid()) {
      let record = {} as UserData;
      record.deviceId = this.session.getDeviceId();
      record.gcmToken = this.session.getGcmToken();      
      this.firebaseService.updateUser(this.session.getUser().id, record).then((res) => {
        console.log("updateUserDetails success");
        me.passcodeSubject.next(PASSCODE_SETTING.PENDING);
      }, (err) => {
        console.log("updateUserDetails error: "+err);
        me.statusLabel = err;
        me.otpSubject.next(OTP_VERIFICATION.FAILED);
      });
    } else {
      this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
    }
  }

  async writeAppData() {
    const me = this;
    const appData = this.mobileNumber+","+"true"+","+this.confirmCode;
    if(this.session.isHybrid()) {
      await this.appPreferences.store("app-data",appData).then((res) => {
        me.handleAppData();
      },function(err) {
        console.log("error: " + err);
        me.statusHeader = err;
      });
    } else {
      this.storage.set("app-data", appData).subscribe(() => {
        me.handleAppData();
      });
    }
  }

  async handleAppData() {
    const me = this;
    console.log("Appdata write success");
    me.session.setMobileNumber(me.mobileNumber);
    me.session.setPassCode(me.confirmCode);
  }

  async presentLoading(message: string) {
    let loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }

  login() {
    this.session.registrationSubject.next(REGISTRATION.COMPLETED);
  }

  add(value: string) {
    this.session.vibrate(EFFECT.KEY_PRESS);
    if(this.passcodeSubject.value == PASSCODE_SETTING.PENDING && this.setCode.length < 4) {
      this.setCode = this.setCode + value;
    } else if(this.passcodeSubject.value == PASSCODE_SETTING.SET && this.setCode.length == 4 && this.confirmCode.length < 4) {
      this.confirmCode = this.confirmCode + value;
    }
  }

  acceptCode() {
    this.session.vibrate(EFFECT.KEY_PRESS);
    if(this.setCode.length == 4 && this.passcodeSubject.value == PASSCODE_SETTING.PENDING) {
      this.passcodeSubject.next(PASSCODE_SETTING.SET);
    }else if(this.setCode.length == 4 && this.confirmCode.length == 4) {
      if(this.setCode == this.confirmCode) {
        console.log("match");
        this.passcodeSubject.next(PASSCODE_SETTING.CONFIRMED);
      }else {
        console.log("no match");
        this.session.vibrate(EFFECT.MEDIUM);
        this.passcodeSubject.next(PASSCODE_SETTING.PENDING);
      }
    }    
  }

  deleteCode() {
    this.session.vibrate(EFFECT.KEY_PRESS);
    if(this.setCode.length > 0 && this.passcodeSubject.value == PASSCODE_SETTING.PENDING) {
      this.setCode = this.setCode.substring(0,this.setCode.length-1);
    }else if (this.confirmCode.length > 0 && this.passcodeSubject.value == PASSCODE_SETTING.SET) {
      this.confirmCode = this.confirmCode.substring(0,this.confirmCode.length-1);
    }
  }

  ngAfterViewInit() {    
    this.otpSubject.next(OTP_VERIFICATION.PENDING);
    if(!this.session.isHybrid()) {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        "size": "invisible"
     });
    }
  }

  ngOnDestroy() {        
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