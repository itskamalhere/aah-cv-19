import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { FormModel, Vital } from '../model/user-model';
import { SessionService, FormContext } from '../services/session.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-vitals',
  templateUrl: './manage-vitals.page.html',
  styleUrls: ['./manage-vitals.page.scss'],
})
export class ManageVitalsPage implements OnInit, AfterViewInit {
  formContext: FormContext;
  vitalForm: FormGroup;
  formModel: any;  
  initValues: AbstractControl;
  selectAlertOptions: any = {
    cssClass: "select-alert-css"
  };

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private firebaseService: FirebaseService,
    private model: FormModel,
    private session: SessionService,
    private functions: AngularFireFunctions
  ) {
      this.formContext = this.session.getFormContext();
   }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {    
  }

  close() {
    this.modalController.dismiss();
  }

  initForm() {
    this.formModel = this.model.VitalModel;
    let formControl = {};
    for (let entry of this.formModel) {
      formControl[entry.attrName] = entry.control;
      //entry.attrType=="lookup"?this.lookup(entry.attrName,entry.attrFnParams):null;
    }
    this.vitalForm = this.formBuilder.group(formControl);
    this.initValues = this.vitalForm.value;
  }

  formVital(forUpdate: boolean) {
    let form = this.vitalForm.value;
    let vital = {} as Vital;
    Object.keys(form).forEach((key) =>{
      let value = form[key];
      if(forUpdate) {
        if(this.vitalForm.get(key).dirty) {
          if(typeof value == "string") {
            vital[key] = value.trim();
          } else {
            vital[key] = value;
          }
        }
      } else {
        if(typeof value == "string") {
          vital[key] = value.trim();
        } else {
          vital[key] = value;
        }
      }
    });
    const data = this.session.getUser().data;
    const name = data.firstName + " " + data.lastName;
    vital.submittedBy = name;
    vital.submittedDate = moment().toString();
    return vital;
  }

  async addVital() {
    await this.presentLoading();    
    let vital = this.formVital(false);    
    this.firebaseService.addVital(this.formContext.userId,vital).then(res => {
      //this.subscribeUsers(record,res.id,(saveAction.length<=0));
      this.dismissLoading(true);
      }).catch(error => {
        console.log(error);
        this.loadingController.dismiss();
        alert(error);
      });
  }

  async updateVital() {

  }

  async presentLoading() {
    let loading = await this.loadingController.create({
      message: 'Saving...'
    });
    await loading.present();
  }

  async dismissLoading(close: boolean) {
    this.loadingController.dismiss();
    this.presentToast("Vitals added successfully");
    this.vitalForm.reset(this.initValues);
    if(close) {
      this.modalController.dismiss();     
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    await toast.present();
  }

}
