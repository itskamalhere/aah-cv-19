import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController} from '@ionic/angular';
import { FormContext, FORM_ACTION, SessionService, FORM_USER } from '../services/session.service';
import { User } from '../model/user-model';
import { FirebaseService } from '../services/firebase.service';
import { UserManagePage } from '../user-manage/user-manage.page';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit, OnDestroy {
  formContext: FormContext;
  segment = "assigned";
  searchTerm = "";
  userList: User[];
  users: User[];
  userSub: Subscription;
  loaded = false;
  constructor(
    public router: Router,    
    private modalController: ModalController,
    private session: SessionService,
    private firebaseService: FirebaseService
    ) {
      this.formContext = this.session.getFormContext();
    }

  ngOnInit() {
    this.loadData();
  }

  segmentChanged(event: any) {
    this.loaded = false;
    this.segment = event.target.value.toLowerCase();    
    this.loadData();
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
      if(this.searchTerm.length == 0) {
        this.users = users;
      } else {
        this.filterData(this.searchTerm);
      }
      this.loaded = true;      
    });
  }

  filterData(event: any, term?: string) {
    if(event && event.target && event.target.value) {
      this.searchTerm = event.target.value.toLowerCase();
    }
    if(term) {
      console.log("inside");
      this.searchTerm = term;
    }
    console.log(this.searchTerm);
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

  async EditUser(id: string) {
    let formContext = this.formContext;    
    formContext.action = FORM_ACTION.EDIT;
    this.session.setFormContext(formContext);
    const modal = await this.modalController.create({
      component: UserManagePage
    });
    return await modal.present();
  }

  showDetails(id: string) {
    let formContext = this.formContext;
    formContext.userId = id;
    this.session.setFormContext(formContext);
    this.router.navigate(['patient-details']);
  }

}