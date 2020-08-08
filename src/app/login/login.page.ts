import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import {
  SessionService,
  AUTHENTICATION,
  EFFECT,
  REGISTRATION,
} from "../services/session.service";
import { FirebaseService } from "../services/firebase.service";
import { User } from "../model/user-model";
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  animations: [
    trigger("shakeAnimation", [
      state("reset", style({})),
      state("set", style({})),
      transition(
        "reset => set",
        animate(
          250,
          keyframes([
            style({ transform: "translateX(-10%)" }),
            style({ transform: "translateX(10%)" }),
            style({ transform: "translateX(-10%)" }),
            style({ transform: "translateX(10%)" }),
          ])
        )
      ),
    ]),
  ],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  shakeAnimation: string = "reset";
  statusHeader: string = "";
  statusLabel: string = "";
  biometricSub: Subscription;
  userSub: Subscription;
  numbers: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  zero: string = "0";
  passCode: string;
  @ViewChild("statusTemplate") private statusTemplate: TemplateRef<object>;
  @ViewChild("passcodeTemplate") private passcodeTemplate: TemplateRef<object>;
  viewTemplate: TemplateRef<object>;
  biometricSubject: BehaviorSubject<
    BIOMETRIC_VERIFICATION
  > = new BehaviorSubject(BIOMETRIC_VERIFICATION.NOT_STARTED);
  userSubject: BehaviorSubject<USER_VERIFICATION> = new BehaviorSubject(
    USER_VERIFICATION.NOT_STARTED
  );

  constructor(
    private biometric: FingerprintAIO,
    private session: SessionService,
    private firebaseService: FirebaseService,
    private appPreferences: AppPreferences,
    private storage: StorageMap
  ) {}

  ngOnInit() {
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
        this.statusHeader = "Enter Passcode";
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
        this.statusLabel =
          "\nReasons:\nNo internet connection, or\nThe app has been registered in different device\nPlease contact administrator.";          
        this.viewTemplate = this.statusTemplate;
      }
    });
  }

  async doAuthentication() {
    const me = this;
    if (this.session.isHybrid()) {
      try {
        this.biometric.isAvailable().then(
          function (result) {
            me.biometric
              .show({
                title: "Biometric Authentication",
                description: "Continue with biometric authentication",
                fallbackButtonTitle: "Use Backup",
                disableBackup: true,
              })
              .then((result: any) => {
                me.biometricSubject.next(BIOMETRIC_VERIFICATION.SUCCESS);
              })
              .catch((error: any) => {
                me.statusLabel =
                  error.message == undefined ? error : error.message;
                me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
              });
          },
          function (error) {
            me.statusLabel = error.message == undefined ? error : error.message;
            if (
              (error &&
                Number(error.code) == me.biometric.BIOMETRIC_NOT_ENROLLED) ||
              Number(error.code) ==
                me.biometric.BIOMETRIC_SCREEN_GUARD_UNSECURED
            ) {
              me.statusLabel =
                "Enable biometric authentication in this device to proceed";
            }
            me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
          }
        );
      } catch (error) {
        me.statusLabel = error.message == undefined ? error : error.message;
        me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
      }
    } else {
      me.biometricSubject.next(BIOMETRIC_VERIFICATION.FAILED);
    }
  }

  verifyUserDevice() {
    const me = this;
    this.firebaseService
      .fetchUsersbyField("mobileNumber", this.session.getMobileNumber(), "==")
      .then(
        async (users) => {
          if (users && users.length > 0) {
            let user = {} as User;
            user.id = [...users][0].id;
            user.ref = [...users][0].ref;
            user.data = [...users][0].data;
            me.session.setUser(user);
            let role = user.data.role;
            if (role) {
              await role.get().then((role) => {                
                me.session.setPermissions(role.data().permissions);
                if (this.session.isHybrid() && this.session.getDeviceId() == user.data.deviceId && user.data.status.toLowerCase() == "active") {
                  me.userSubject.next(USER_VERIFICATION.SUCCESS);
                } else if (!this.session.isHybrid() && user.data.status.toLowerCase() == "active") {
                  me.userSubject.next(USER_VERIFICATION.SUCCESS);
                } else {
                  me.userSubject.next(USER_VERIFICATION.FAILED);
                }
              });
            } else {
              me.userSubject.next(USER_VERIFICATION.FAILED);
            }
          } else {
            me.userSubject.next(USER_VERIFICATION.FAILED);
          }
        },
        (err) => {
          console.log("error: " + err);
          me.statusLabel = err;
          me.userSubject.next(USER_VERIFICATION.FAILED);
        }
      );
  }

  add(value: string) {
    this.session.vibrate(EFFECT.KEY_PRESS);
    if (this.passCode.length < 4) {
      this.passCode = this.passCode + value;
    }
    if (this.passCode.length == 4) {
      this.acceptCode();
    }
  }

  acceptCode() {
    this.session.vibrate(EFFECT.KEY_PRESS);
    let confirmCode = this.session.getPassCode();
    if (this.passCode == confirmCode) {
      this.userSubject.next(USER_VERIFICATION.PENDING);
      this.biometricSubject.next(BIOMETRIC_VERIFICATION.SUCCESS);
    } else {
      this.passCode = "";
      this.shakeAnimation = "set";
      this.statusHeader = "Wrong Passcode";
      this.session.vibrate(EFFECT.MEDIUM);
    }
  }

  resetShake() {
    if (this.shakeAnimation === "set") {
      this.shakeAnimation = "reset";
      this.statusHeader = "Enter Passcode";
    }
  }

  deleteCode() {
    this.session.vibrate(EFFECT.KEY_PRESS);
    if (this.passCode.length > 0) {
      this.passCode = this.passCode.substring(0, this.passCode.length - 1);
    }
  }

  async forgotCode() {
    if(this.session.isHybrid()) {
      this.appPreferences.remove("app-data").then((res) => {
        this.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
      })
    } else {
      this.storage.delete("app-data").subscribe(() => {
        this.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
      });
    }    
  }

  ngAfterViewInit() {
    this.biometricSubject.next(BIOMETRIC_VERIFICATION.PENDING);
  }

  ngOnDestroy() {
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
  FAILED = 3,
}

enum USER_VERIFICATION {
  NOT_STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
}
