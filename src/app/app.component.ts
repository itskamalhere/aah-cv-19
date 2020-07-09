import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { AppPreferences } from "@ionic-native/app-preferences/ngx";
import { Subscription } from 'rxjs';
import { SessionService, REGISTRATION, AUTHENTICATION } from "./services/session.service";
import { Plugins } from '@capacitor/core';

const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private registrationSub: Subscription;
  private authenticationSub: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private appPreferences: AppPreferences,
    private session: SessionService
  ) {}

  ngOnInit() {

    StatusBar.setBackgroundColor({ color: "#ffffff" });
    this.session.registrationSubject.next(REGISTRATION.CHECK);

    this.registrationSub = this.session.registrationSubject.subscribe((status) => {
      if (status == REGISTRATION.CHECK) {
        this.loadPrefData();
      } else if (status == REGISTRATION.COMPLETED) {
        this.session.authenticationSubject.next(AUTHENTICATION.PENDING);
      } else if (status == REGISTRATION.NOT_COMPLETED) {
        //this.router.navigate(["register"]);
        this.router.navigate(["home"]);
      }
    });

    this.authenticationSub = this.session.authenticationSubject.subscribe((status) => {
      if (status == AUTHENTICATION.PENDING || status == AUTHENTICATION.LOGGED_OUT) {
        this.router.navigate(["login"]);
      } else if (status == AUTHENTICATION.SUCCESS) {
        this.router.navigate(["home"]);
      }
    });
  }

 loadPrefData() {
  const me = this;
  this.appPreferences.fetch("app-data").then((res) => {
    if (res && null != res) {
      var appDataArr = res.split(",");
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
  },function(err) {
    console.log("Error: "+err);
    me.session.registrationSubject.next(REGISTRATION.NOT_COMPLETED);
  });
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
