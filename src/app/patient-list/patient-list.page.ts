import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController, IonSearchbar, Platform, IonRouterOutlet} from '@ionic/angular';
import { FormContext, FORM_ACTION, SessionService, FORM_USER } from '../services/session.service';
import { User, UserData } from '../model/user-model';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { FirebaseService } from '../services/firebase.service';
import { UserManagePage } from '../user-manage/user-manage.page';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
  animations: [
    trigger('slideRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('0.3s ease', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideLeft', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('0.3s ease', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('0.3s ease', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class PatientListPage implements OnInit, AfterViewInit, OnDestroy {
  formContext: FormContext;
  segment = "assigned";  
  searchTerm = "";
  userList: User[];
  users: User[];
  userSub: Subscription;
  loaded = false;
  searchOpen: boolean = false;
  subscribed: boolean = false;
  @ViewChild("searchBar",{static: false}) private searchBar: IonSearchbar;
  constructor(
    public router: Router,
    private modalController: ModalController,
    private session: SessionService,
    private firebaseService: FirebaseService,
    private firebase: FirebaseX,
    private appPreferences: AppPreferences,
    private platform: Platform    
    ) {
      this.formContext = this.session.getFormContext();
    }

  ngOnInit() {
    this.loadData();    
    let sessionUser = this.session.getUser();
    if(sessionUser && sessionUser.data && sessionUser.data.userType == "Staff") {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        let currentUrl = this.router.url;
        if(currentUrl && (currentUrl.indexOf("patient-list") > -1 || currentUrl.indexOf("staff-list") > -1)) {
          App.exitApp();
        }
      });
    }
  }

  ngAfterViewInit() {
    
  }

  segmentChanged(event: any) {
    this.loaded = false;
    this.segment = event.target.value.toLowerCase();
    this.loadData();
  }

  async subscribeTopics(newTopics: string[]) {
    const me = this;
    this.appPreferences.fetch("topics","topics").then(async (oldTopics) => {
      await this.unSubscribeTopics(oldTopics);
      for(const topic of newTopics) {
        await me.firebase.subscribe(topic);        
      }
      await me.writeTopics(newTopics);
      this.subscribed = true;
    },function(err) {
      console.log("Error: "+err);
    });
  }

  async unSubscribeTopics(oldTopics: string[]) {
    if(oldTopics) {
      for(const topic of oldTopics) {
        await this.firebase.unsubscribe(topic);
      }
    }
  }

  async writeTopics(topics: string[]) {
    this.appPreferences.store("topics","topics",topics).then((res) => {
    },function(err) {
      console.log("error: " + err);
    });
  }

  getAvatar(gender: string, role: any) {
    role = role.path.toString();
    role = role.substring(role.lastIndexOf("/")+1);
    let userType = this.formContext.userType;
    let imgUrl = "";
    /////
    if(gender == "Male") {
      imgUrl = "../assets/images/male.png";
    } else {
      imgUrl = "../assets/images/female.png";
    }
//////
    // if(userType==FORM_USER.PATIENT) {
    //   if(gender == "Male") {
    //     imgUrl = "../assets/images/male.png";
    //   } else {
    //     imgUrl = "../assets/images/female.png";
    //   }
    // } else {
    //   if(role.indexOf("doc") > -1) {
    //     if(gender == "Male") {
    //       imgUrl = "../assets/images/male_doctor.png";
    //     } else {
    //       imgUrl = "../assets/images/female_doctor.png";
    //     }
    //   }
    // }
    return imgUrl;
  }

  loadData() {
    this.users = [];
    let userType = this.formContext.userType;
    let assignedTo = this.segment=="assigned"&&userType==FORM_USER.PATIENT?this.session.getUser().id:undefined;    
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
    this.userSub = this.firebaseService.fetchUsers(userType.toString(),assignedTo).subscribe(users => {
      this.userList = users;
      if(this.session.isHybrid() && !this.subscribed && this.segment=="assigned" && userType==FORM_USER.PATIENT) {
        let topics = users.map(a=> a.data.uhid);
        let role = this.session.getUser().data.role.path.toString();
        role = role.substring(role.lastIndexOf("/")+1);
        let userType = this.session.getUser().data.userType;
        topics.push(role);
        topics.push(userType);
        this.subscribeTopics(topics);
      }
      if(this.searchTerm.length == 0) {
        this.users = users;
      }
      this.loaded = true;
    });
  }

  filterData(event: any, term: string) {
    if(event && event.target && event.target.value) {
      this.searchTerm = event.target.value.toLowerCase();
    } else if(term && term.length > 0) {
      this.searchTerm = event.target.value.toLowerCase();
    } else {
      this.searchTerm = "";
    }
    this.users = this.userList.filter(user => {
      let nameMatch: boolean = false;
      let uhidMatch: boolean = false;
      let mobileNumberMatch: boolean = false;
      if(user && user.data && user.data.firstName && user.data.lastName) {
        const name = user.data.firstName + " " + user.data.lastName;
        nameMatch = name.toLowerCase().indexOf(this.searchTerm) > -1;
      }
      if(user && user.data && user.data.uhid) {
        uhidMatch = user.data.uhid.toLowerCase().indexOf(this.searchTerm) > -1;
      }
      if(user && user.data && user.data.mobileNumber) {
        mobileNumberMatch = user.data.mobileNumber.toLowerCase().indexOf(this.searchTerm) > -1;
      }
      return nameMatch || uhidMatch || mobileNumberMatch;
    });
  }

  selectSearch() {
    this.searchOpen = true;
    {setTimeout(() =>
    this.searchBar.setFocus(), 200);}
  }

  cancelSearch() {
    this.filterData("","");
    this.searchOpen=false;
  }

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }    
  }

  async addUser() {
    let formContext = this.formContext;
    formContext.action = FORM_ACTION.ADD;
    this.session.setFormContext(formContext);
    const modal = await this.modalController.create({
      component: UserManagePage
    });
    return await modal.present();
  }

  showDetails(user: User) {
    let formContext = this.formContext;
    formContext.user = user;
    this.session.setFormContext(formContext);
    this.router.navigate(['patient-details']);
  }

}