import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PatientDetails } from '../model/patient-details';
import { NodeJSService } from '../services/node-js.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy, AfterViewInit {  
  constructor(
    private platform: Platform,
    public authService: AuthService,
    private navCtrl: NavController,
    private route: Router
    ) {
      let svc = new NodeJSService();
      let val = svc.getPatientsList();
      console.log(val);
      this.platform.ready().then(() => {
        authService.doAuthentication();
      });
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    // document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
    //   ev.detail.register(-1, () => {
    //     App.exitApp();
    //   });
    // });
  }

  ngOnDestroy() {}

  getPatientDetails() {
    this.route.navigate(['/home']);
  }

  
}