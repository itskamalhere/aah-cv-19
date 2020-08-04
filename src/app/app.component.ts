import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { AppPreferences } from "@ionic-native/app-preferences/ngx";
import { StorageMap } from "@ngx-pwa/local-storage";
import { Subscription } from 'rxjs';
import { SessionService, REGISTRATION, AUTHENTICATION, FormContext, FORM_USER } from "./services/session.service";
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { User, UserData } from './model/user-model';

const { SplashScreen,StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  hybrid: boolean;
  private registrationSub: Subscription;
  private authenticationSub: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private appPreferences: AppPreferences,
    private storage: StorageMap,
    private session: SessionService,
    private firebase: FirebaseX
  ) {}

  ngOnInit() {

    if(this.platform.is("hybrid")) {
      this.hybrid = true;
    }

    if(this.hybrid) {
      StatusBar.setBackgroundColor({ color: "#ffffff" });
      StatusBar.setStyle({ style: StatusBarStyle.Light });
      StatusBar.show();
      SplashScreen.hide();
      this.firebase.onMessageReceived().subscribe((data) => {
        if(data && data.id) {
          let formContext = this.session.getFormContext();
          if (!formContext || (formContext && !formContext.user)) {
            formContext = {} as FormContext;
            let user = {} as User;
            let userData = {} as UserData;
            user.data = userData;
            formContext.user = user;
          }
          if(data.uhid) {
            formContext.user.data.uhid = data.uhid;
          }
          formContext.user.id = data.id;
          formContext.userType = FORM_USER.PATIENT;
          this.session.setFormContext(formContext);
          if(this.session.authenticationSubject.value == AUTHENTICATION.SUCCESS) {
            this.router.navigate(['patient-details']);
          } else {
            this.session.authenticationSubject.next(AUTHENTICATION.PENDING);
          }
        } else {
          if(this.session.authenticationSubject.value == AUTHENTICATION.SUCCESS) {
            this.router.navigate(['patient-details']);
            //this.session.authenticationSubject.next(AUTHENTICATION.SUCCESS);
          } else {
            this.session.authenticationSubject.next(AUTHENTICATION.PENDING);
          }
        }
      });
    }

    this.session.registrationSubject.next(REGISTRATION.CHECK);
    this.registrationSub = this.session.registrationSubject.subscribe((status) => {
      if (status == REGISTRATION.CHECK) {
        this.loadPrefData();
      } else if (status == REGISTRATION.COMPLETED) {
        this.session.authenticationSubject.next(AUTHENTICATION.PENDING);
      } else if (status == REGISTRATION.NOT_COMPLETED) {
        this.router.navigate(["register"]);
      }
    });

    this.authenticationSub = this.session.authenticationSubject.subscribe((status) => {
      if (status == AUTHENTICATION.PENDING || status == AUTHENTICATION.LOGGED_OUT) {
        this.router.navigate(["login"]);
      } else if (status == AUTHENTICATION.SUCCESS) {
        let formContext = this.session.getFormContext();
        if (!formContext) {
          formContext = {} as FormContext;
          formContext.userType = FORM_USER.PATIENT;
          this.session.setFormContext(formContext);
          let route = "patient-list";
          if(this.session.getUser().data.userType == "Patient") {
            route = "patient-details";
          }
          this.router.navigate(['home',route]);
        } else {
          this.router.navigate(['patient-details']);
        }
      }
    });
  }

 loadPrefData() {
  const me = this;
  if(this.hybrid) {
    this.appPreferences.fetch("app-data").then((data) => {
      me.handleAppData(data);
    },function(err) {
      console.log("Error: "+err);
      me.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
    });
  } else {
    this.storage.get("app-data", { type: "string" }).subscribe((data) => {
      me.handleAppData(data);
    }, () => {});
  }
}

 handleAppData(data: any) {
  const me = this;
  if (data && null != data) {
    var appDataArr = data.split(",");
    me.session.setMobileNumber(String(appDataArr[0]));
    me.session.setPassCode(String(appDataArr[2]));
    if(JSON.parse(String(appDataArr[1]))) {
      me.session.registrationSubject.next(REGISTRATION.COMPLETED);
    } else {
      me.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
    }
  } else {
    me.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
  }
 }

 ngOnDestroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.registrationSub) {
      this.registrationSub.unsubscribe();
    }
    if (this.authenticationSub) {
      this.authenticationSub.unsubscribe();
    }
  }
  
}
