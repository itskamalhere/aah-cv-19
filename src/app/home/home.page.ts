import {Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { SessionService, FormContext, FORM_USER } from '../services/session.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})

export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  form_user = FORM_USER;
  constructor(private session: SessionService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
    //   ev.detail.register(-1, () => {
    //     App.exitApp();
    //   });
    // });
  }

  setContext(userType: FORM_USER) {
    let formContext = {} as FormContext;
    formContext.userType = userType;
    this.session.setFormContext(formContext);
  }

  ngOnDestroy() {}

}
