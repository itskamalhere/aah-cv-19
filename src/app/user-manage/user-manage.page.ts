import { Component, OnInit } from '@angular/core';
import { FormModel, UserData } from '../model/user-model';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { SessionService, FormContext, FORM_USER, FORM_ACTION } from '../services/session.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController, ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ValidationService } from '../services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
})

export class UserManagePage implements OnInit {
  formContext: FormContext;
  userForm: FormGroup;
  formModel: any;
  initValues: AbstractControl;
  patientRoles = [];
  staffRoles = [];
  selectAlertOptions: any = {
    cssClass: "select-alert-css"
  };  
  valuesSub: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private firebaseService: FirebaseService,    
    private validationService: ValidationService,
    private session: SessionService,
    private functions: AngularFireFunctions
    ) {
      this.formContext = this.session.getFormContext();
      if(this.formContext.userType == FORM_USER.PATIENT) {
        this.formModel = new FormModel().PatientModel;
      } else {
        this.formModel = new FormModel().StaffModel;
      }
   }

  ngOnInit() {    
    this.initForm();
  }

  close() {
    this.modalController.dismiss();
  }

  async initForm() {
    if(this.formContext.action == FORM_ACTION.EDIT) {
      await this.presentLoading("Loading...");
    }
    let formControl = {};
    for (let entry of this.formModel) {
      formControl[entry.attrName] = entry.control;
      entry.attrType=="lookup"?this.lookup(entry.attrName,entry.attrFnParams):null;
    }
    this.userForm = this.formBuilder.group(formControl);
    this.initValues = this.userForm.value;
  }

  setValuesForEdit() {
    this.firebaseService.fetchUserbyId(this.formContext.user.id).then((user) => {
      if(user) {
        Object.keys(this.userForm.controls).forEach((fieldName) =>{
          let fieldValue = user.data[fieldName];
          if(fieldValue && fieldValue != undefined) {
            let attr = this.formModel.find(attr => attr.attrName === fieldName);
            if(!attr.attrEditable) {
              this.userForm.get(fieldName).disable();
            }
            if(fieldValue && fieldValue.path){
              fieldValue = fieldValue.path.toString();
              fieldValue = fieldValue.substring(fieldValue.lastIndexOf("/")+1);
            }
            this.userForm.get(fieldName).setValue(fieldValue, {onlySelf: true});
          }
        });
        this.userForm.markAllAsTouched();
        this.loadingController.dismiss();
      }
    }, (err) => {
      return null;
    });
  }

  async lookup(fieldName: string, fnParams: any) {
    let index = this.formModel.findIndex(field => field.attrName === fieldName);
    const options = this.formModel[index].attrOptions;
    if(!options) {
      if(this.valuesSub) {
        this.valuesSub.unsubscribe();        
      }
      this.formModel[index].attrOptions = this.firebaseService.lookup(fnParams);
      this.valuesSub = this.formModel[index].attrOptions.subscribe(values => {
        if(this.valuesSub) {
          this.valuesSub.unsubscribe();
        }
        if(this.formContext.action == FORM_ACTION.EDIT) {
          this.setValuesForEdit();
        }
      });
    }
  }

  cleanForm(forUpdate: boolean) {
    let form = this.userForm.value;
    let record = {} as UserData;
    Object.keys(form).forEach((key) =>{
      let value = form[key];
      if(forUpdate) {
        if(this.userForm.get(key).dirty) {
          if(typeof value == "string") {            
            record[key] = key=="bloodType"?value.toUpperCase().trim():value.trim();            
          } else {
            record[key] = value;
          }
        }
      } else {
        if(typeof value == "string") {
          record[key] = key=="bloodType"?value.toUpperCase().trim():value.trim();
        } else {
          record[key] = value;
        }
      }
    });
    return record;
  }

  async subscribeUsers(record: any, id: string, close: boolean) {
    this.getTokens(record).then(tokens => {      
      if(tokens && tokens.length > 0) {
        var uhid = this.userForm.get("uhid").value;
        var firstName = this.userForm.get("firstName").value;
        var lastName = this.userForm.get("lastName").value;
        var fullName = firstName+" "+lastName;
        this.functions.httpsCallable("subscribeUsers")(
          {tokens:tokens,id:id,uhid:uhid,fullName:fullName}).pipe(first())
        .subscribe(resp => {
          console.log({ resp });
          this.dismissLoading(close);
        }, err => {
          console.error({ err });
          this.dismissLoading(close);
        });
      } else {
        this.dismissLoading(close);
      }
    });
  }

  getTokens(record: any) {
    return new Promise<any[]>((resolve) => {
      let index = this.formModel.findIndex(field => field.attrName === "assignedTo");
      let options;
      if(index && this.formModel[index]) {
        options = this.formModel[index].attrOptions;
      }
      const tokens = [];
      if(options) {
        let sub = options.subscribe(async (options: any[]) => {
          options.forEach((e1)=>record.assignedTo.forEach((e2: string)=> {
            if(e1.value === e2 && e1.data.gcmToken && e1.data.gcmToken.length > 0){
              tokens.push(e1.data.gcmToken);
              }
            }
          ));
          resolve(tokens);
          if(sub && !sub.closed) {
            sub.unsubscribe();
          }
        });
      } else {
        resolve(undefined);
      }
    });
  }

  async addUser(saveAction: string) {
    await this.presentLoading("Saving...");
    let record = this.cleanForm(false);
    this.firebaseService.addUser(record).then(res => {
      this.subscribeUsers(record,res.id,(saveAction.length<=0));
      }).catch(error => {
        console.log(error);
        this.loadingController.dismiss();
        alert(error);
      });
  }

  async updateUser() {
    await this.presentLoading("Saving...");
    let record = this.cleanForm(true);
    this.firebaseService.updateUser(this.formContext.user.id, record).then(resp => {      
      if(record.assignedTo) {
        this.subscribeUsers(record,this.formContext.user.id,true);
      } else {
        this.dismissLoading(true);
      }
    }).catch(error => {
      console.log(error);
      this.loadingController.dismiss();
      alert(error);
    })
  }

  reset() {
    this.userForm.reset(this.initValues);
  }

  async presentLoading(message: string) {
    let loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }

  async dismissLoading(close: boolean) {
    this.loadingController.dismiss();
    this.presentToast("Record saved successfully");
    this.userForm.reset(this.initValues);
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
