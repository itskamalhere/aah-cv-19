import { Component, OnInit } from '@angular/core';
import { PatientDetails } from '../../../model/patient-details';
import { NodeJSService } from '../../../services/node-js.service';
import { Router } from '@angular/router';
import { PatientDetailsPage } from '../patient-details/patient-details.page';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {

  patientDetails: PatientDetails[];
  nodeJSService: NodeJSService;
  constructor(public router: Router) {
    this.nodeJSService = new NodeJSService();
    this.patientDetails = this.nodeJSService.getPatientsList();
  }

  ngOnInit() {
  }

  getDetailsPage() {
    console.log("Get Patient Details Page");
    this.router.navigate(['/patient-details']);
  }

}