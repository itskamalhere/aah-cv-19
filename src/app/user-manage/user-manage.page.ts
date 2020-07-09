import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormContext, PatientModel } from '../model/user-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
})

export class UserManagePage implements OnInit {
  formContext: FormContext;
  userForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    ) {
    this.route.queryParams.subscribe((data) => {      
      this.formContext = {} as FormContext;
      this.formContext.userType = data.userType;
      this.formContext.action = data.action;      
    });
   }

  ngOnInit() {

    let formModel = PatientModel;
    this.userForm = this.formBuilder.group(formModel);
    //this.userForm.controls['country'].setValue("default", {onlySelf: true});
  }

  createUser() {    
    this.firebaseService.createUser(this.userForm.value).then(resp => {        
        //this.userForm.reset();
      }).catch(error => {
        console.log(error);
      });
  }

}
