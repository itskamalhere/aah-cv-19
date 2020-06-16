import { PatientDetails } from '../model/patient-details';

export class NodeJSService {

    getPatientsList() {
        let patList: PatientDetails[] = [
            {
                id: "ID1",
                firstName: "First Name",
                lastName: "Last Name",
                aadharNo: "Aadhaar No 1"
            }, 
            {
                id: "ID2",
                firstName: "First Name2",
                lastName: "Last Name2",
                aadharNo: "Aadhaar No 2"
            }, 
            {
                id: "ID3",
                firstName: "First Name3",
                lastName: "Last Name3",
                aadharNo: "Aadhaar No 3"
            }
        ];
        return patList;
    }

    getPatientDetails() {
        let patientDetail: PatientDetails = {
            id: "ID1",
            firstName: "First Name",
            lastName: "Last Name",
            aadharNo: "Aadhaar No 1"
        };
        return patientDetail;
    }
}