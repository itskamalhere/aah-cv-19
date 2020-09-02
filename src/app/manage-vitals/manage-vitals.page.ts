import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { FormModel, Vital } from '../model/user-model';
import { SessionService, FormContext } from '../services/session.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first } from 'rxjs/operators';

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
    this.formModel = new FormModel().VitalModel;
    let formControl = {};
    for (let entry of this.formModel) {
      formControl[entry.attrName] = entry.control;
      //entry.attrType=="lookup"?this.lookup(entry.attrName,entry.attrFnParams):null;
    }
    this.vitalForm = this.formBuilder.group(formControl);
    this.initValues = this.vitalForm.value;
  }

  isFormInvalid() {    
    let form = this.vitalForm.value;
    let formValues = "";
    let hasNoValue: boolean = false;
    let bpAvailable: boolean = false;
    let invalidBp: boolean = false;
    let sys = form["bpSystolic"];
    let dias = form["bpDiastolic"];
    bpAvailable = ((sys && sys.length>0) || (dias && dias.length>0))?true:false;
    if (bpAvailable) {
      invalidBp = (sys && dias && sys.length > 0 && dias.length > 0)?false:true;
      return invalidBp;
    } else {
      Object.keys(form).forEach((key) =>{
        if(key != "note" && key != "submittedDate") {
          formValues = formValues + form[key];
        }        
      });
      hasNoValue = (formValues && formValues.trim().length > 0)?false:true;      
      return hasNoValue;
    }
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
    return vital;
  }

  async addVital() {
    await this.presentLoading();    
    let vital = this.formVital(false);    
    this.firebaseService.addVital(this.formContext.user.id,vital).then(res => {
      this.notifyUsers();
      }).catch(error => {
        console.log(error);
        this.loadingController.dismiss();
        alert(error);
      });
  }

  async updateVital() {

  }

  async notifyUsers() {
    var id = this.formContext.user.id;
    var uhid = this.formContext.user.data.uhid;
    var firstName = this.formContext.user.data.firstName;
    var lastName = this.formContext.user.data.lastName;
    var fullName = firstName+" "+lastName;
    this.functions.httpsCallable("entryAdded")(
      {id:id,uhid:uhid,fullName:fullName,entryName:"Vital"}).pipe(first())
    .subscribe(resp => {
      console.log({ resp });
      this.dismissLoading();
    }, err => {
      console.error({ err });
      this.dismissLoading();
    });
  }

  async presentLoading() {
    let loading = await this.loadingController.create({
      message: "Saving..."
    });
    await loading.present();
  }

  async dismissLoading() {
    this.loadingController.dismiss();
    this.presentToast("Vitals added successfully");
    this.vitalForm.reset(this.initValues);
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    await toast.present();
  }

}
