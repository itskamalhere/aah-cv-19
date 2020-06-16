import { Component, OnInit } from '@angular/core';
import { PatientDetails } from '../../../model/patient-details';
import { NodeJSService } from '../../../services/node-js.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})
export class PatientDetailsPage implements OnInit {

  patientDetails: PatientDetails;
  nodeJSService: NodeJSService;
  constructor() { 
    this.nodeJSService = new NodeJSService();
    this.patientDetails = this.nodeJSService.getPatientDetails();
  }

  ngOnInit() {
  }

}