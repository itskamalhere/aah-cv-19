import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormContext } from '../model/user-model';

interface userData {
  firstName: string;
  lastName: string;
  age: number;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {  
  formContext: FormContext;
  users$: Observable<any[]>;
  userForm: FormGroup;
  constructor(
    public router: Router,
    private firebaseService: FirebaseService,
    public fb: FormBuilder
    ) {
      //this.users = firestore.collection("users").valueChanges({idField: 'userId'});       
      //this.vitals = firestore.collection('users/rJxyRbbsDKBXLta0UXbl/vitals').valueChanges();
      //this.vitals = firestore.collection("users", ref => 
      //ref.where("firstName", "==", "John")).doc().collection("vitals").valueChanges();
    }
  ngOnInit() {
    this.formContext = {} as FormContext;
    this.formContext.userType = "staff";
    this.formContext.action = "create";
    this.users$ = this.firebaseService.fetchUsers();    

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      //age: ['', [Validators.required]]
      age: ['10']
    });

  }

  CreateRecord() {
    this.firebaseService.createUser(this.userForm.value)
      .then(resp => {
        //Reset form
        this.userForm.reset();
      })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.deleteUser(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditFirstName = record.firstName;
    record.EditLastName = record.lastName;
    record.EditAge = record.age;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['firstName'] = recordRow.EditFirstName;
    record['lastName'] = recordRow.EditLastName;
    record['age'] = recordRow.EditAge;
    this.firebaseService.updateUser(recordRow.id, record);
    recordRow.isEdit = false;
  }

  manageUser(action: string) {
    this.router.navigate(['user-manage'], {
      queryParams: {
        userType: this.formContext.userType,
        action: action
       }
    });
  }


  getDetailsPage(user) {
    console.log("Get Patient Details Page");
    this.router.navigate(['patient-details'], {
      queryParams: { value: 'test' }
    });
  }
}