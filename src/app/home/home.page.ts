import {Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})

export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  constructor(   
    private router: Router,
    private firebase: FirebaseX,
  ) {}

  ngOnInit() {
    this.firebase.onMessageReceived().subscribe((data) => {
      this.router.navigate(["/patient-details"]);
    });
  }

  ngAfterViewInit() {
    // document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
    //   ev.detail.register(-1, () => {
    //     App.exitApp();
    //   });
    // });
  }

  ngOnDestroy() {}

}
