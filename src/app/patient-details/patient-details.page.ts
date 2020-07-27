import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ChartDataSets, Chart, TimeScale, TimeDisplayFormat } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ManageVitalsPage } from '../manage-vitals/manage-vitals.page';
import { ChartConfig, VitalsConfig, DAY_TIMESCALE, WEEK_TIMESCALE, MONTH_TIMESCALE, YEAR_TIMESCALE } from './chart-interface';
import * as moment from 'moment';
import { FormContext, SessionService, MODAL_ACTION, FORM_MODAL } from '../services/session.service';
import { Subscription } from 'rxjs';
import { UserData, Vital } from '../model/user-model';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss']
})

export class PatientDetailsPage implements OnInit, OnDestroy {
  formContext: FormContext;
  user: UserData;
  userSub: Subscription;
  segment = "details";
  displayBy = "day";
  userDetails: UserData;
  vitalsStartDate: string;
  vitalsEndDate: string;
  selectedDate: string;
  weekStartDate: string
  weekEndDate: string;
  monthDate: string;
  yearDate: string;
  disableIncrease: boolean = false;
  disableDecrease: boolean = false;
  vitalsChartConfigs: ChartConfig[];
  fromDateVal: string;
  toDateVal: string;
  loaded: boolean = false;

  constructor(
    private session: SessionService,
    private firebaseService: FirebaseService,
    private modalController: ModalController
    ) {
    this.formContext = this.session.getFormContext();
    this.user = {} as UserData;
    this.userDetails = {} as UserData;
    this.userSub = this.firebaseService.fetchUserbyId$(this.formContext.userId).subscribe(user => {
      this.user = user;
      this.userDetails = user;
      if(!this.loaded && this.userDetails && this.userDetails.vitals) {
        this.sortVitalsInDescOrder();
        this.initializeVitalsDateRange();
        this.selectedDate = moment(this.vitalsEndDate).format("YYYY-MM-DD").toString();
        this.weekStartDate = moment(this.vitalsEndDate).startOf('day').subtract(6, 'days').toString();
        this.weekEndDate = this.vitalsEndDate;
        this.monthDate = moment(this.vitalsEndDate).startOf('month').toString();
        this.yearDate = moment(this.vitalsEndDate).startOf('year').toString();
        this.setDateRangeControls();
        this.setChartData(true);
        this.loaded = true;
      } else {
        this.sortVitalsInDescOrder();
        this.setChartData(false);
      }      
    });
  }

  ngOnInit() {
    //this.userDetails = new TestData().prepareData();
  }

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  initializeChartConfig() {
    console.log("Initialize Chart Config");
    this.vitalsChartConfigs = [];
    let vitalsConfig = [... (new VitalsConfig().vitalsConfigModel)];
    for (let vital of vitalsConfig) {
      let sampleChartConfig = {} as ChartConfig;
      sampleChartConfig = {
        id: "",
        chartData: [],
        chartLabels: [],
        chartType: 'line',
        chartOptions: [],
        chartColors: [{
          borderColor: '#000000',
          backgroundColor: '#ff00ff'
        }],
        showLegend: true
      }
      sampleChartConfig.id = vital.id;
      let idVals = vital.id;
      if (idVals.includes("|")) {
        let idValArr = idVals.split("|");
        let indexPos = 0;
        let labelVals = vital.label.split("|");
        for (let idVal of idValArr) {
          sampleChartConfig.chartData[indexPos] = { data: [], label: labelVals[indexPos] }
          indexPos++;
        }
      } else {
        sampleChartConfig.chartData = [{ data: [], label: vital.label }];
      }
      sampleChartConfig.chartOptions = vital.chartOptions;
      sampleChartConfig.chartOptions.scales.xAxes[0].time = this.getTimeType();
      this.vitalsChartConfigs.push(sampleChartConfig);
    }
  }

  getTimeType(): TimeScale {
    console.log("get Time Type");
    let timeScale: TimeScale = {} as TimeScale;
    if (this.displayBy == 'day')
      timeScale = DAY_TIMESCALE;
    else if (this.displayBy == 'week')
      timeScale = WEEK_TIMESCALE;
    else if (this.displayBy == 'month')
      timeScale = MONTH_TIMESCALE;
    else if (this.displayBy == 'year')
      timeScale = YEAR_TIMESCALE;
    return timeScale;
  }

  changeDisplayBy() {     
    this.disableIncrease = false;
    this.disableDecrease = false;
    this.setDateRangeControls();
    this.setChartData(true);
  }

  getVitalsData() {    
    let allVitals = this.userDetails.vitals?this.userDetails.vitals:[];
    if (this.displayBy == 'day') {
      this.fromDateVal = moment(this.selectedDate).startOf('day').toString();
      this.toDateVal = moment(this.selectedDate).endOf('day').toString();
    }
    else if (this.displayBy == 'week') {
      this.fromDateVal = moment(this.weekStartDate).startOf('day').toString();
      this.toDateVal = moment(this.weekEndDate).endOf('day').toString();
    }
    else if (this.displayBy == 'month') {
      this.fromDateVal = moment(this.monthDate).startOf('month').toString();
      this.toDateVal = moment(this.monthDate).endOf('month').toString();
    }
    else if (this.displayBy == 'year') {
      this.fromDateVal = moment(this.yearDate).startOf('year').toString();
      this.toDateVal = moment(this.yearDate).endOf('year').toString();
    }
    let vitalsOnSelectedDate = allVitals.filter((item: any) => {
      return moment(item.submittedDate).isAfter(this.fromDateVal) &&
        moment(item.submittedDate).isBefore(this.toDateVal);
    });
    return vitalsOnSelectedDate;
  }

  setChartData(initialize: boolean) {    
    if(initialize) {
      this.initializeChartConfig();
    }    
    let vitalsOnSelectedDate = this.getVitalsData();    
    if(this.vitalsChartConfigs) {
      for (let chartConfig of this.vitalsChartConfigs) {
        let idVals = chartConfig.id;
        chartConfig.chartLabels = [this.fromDateVal.toString(), this.toDateVal.toString()];
        if (idVals.includes("|")) {
          let idValArr = idVals.split("|");
          let indexPos = 0;
          for (let idVal of idValArr) {
            chartConfig.chartData[indexPos].data = [null, null];
            indexPos++;
          }
          for (let vitalOnSelectedDate of vitalsOnSelectedDate) {
            chartConfig.chartLabels.push(vitalOnSelectedDate.submittedDate.toString());
            let indexPos = 0;
            for (let idVal of idValArr) {
              if (vitalOnSelectedDate[idVal] != undefined)
                chartConfig.chartData[indexPos].data.push(vitalOnSelectedDate[idVal]);
              indexPos++;
            }
          }
        } else {
          chartConfig.chartData[0].data = [null, null];
          for (let vitalOnSelectedDate of vitalsOnSelectedDate) {
            if (vitalOnSelectedDate[chartConfig.id] != undefined &&
              vitalOnSelectedDate[chartConfig.id] != null) {
              chartConfig.chartLabels.push(vitalOnSelectedDate.submittedDate.toString());
              chartConfig.chartData[0].data.push(vitalOnSelectedDate[chartConfig.id]);
            }
          }
        }
      }
    }
  }

  initializeVitalsDateRange() {    
    let vitalsData = this.userDetails.vitals;
    let distinctSubmittedByDateStrVals: string[] = [];
    for (let vitalData of vitalsData) {
      if (!distinctSubmittedByDateStrVals.includes(vitalData.submittedDate.toString())) {
        distinctSubmittedByDateStrVals.push(vitalData.submittedDate.toString());
      }
    }
    let moments = distinctSubmittedByDateStrVals.map(d => moment(d));
    this.vitalsEndDate = moment().format("YYYY-MM-DD").toString();
    this.vitalsStartDate = moment.min(moments).format("YYYY-MM-DD").toString();
  }

  onChangeDate() {    
    this.changeDisplayBy();
  }

  setDateRangeControls() {   
    if (this.displayBy == 'day') {
      if (moment(this.selectedDate).isSame(this.vitalsStartDate, 'day')) {
        this.disableDecrease = true;
      }
      if (moment(this.selectedDate).isSame(this.vitalsEndDate, 'day')) {
        this.disableIncrease = true;
      }
    }
    if (this.displayBy == 'week') {
      if (moment(this.weekStartDate).isSameOrBefore(this.vitalsStartDate, 'day'))
        this.disableDecrease = true;
      if (moment(this.weekEndDate).isSameOrAfter(this.vitalsEndDate, 'day')) {
        this.disableIncrease = true;
      }
    }
    if (this.displayBy == 'month') {
      if (moment(this.monthDate).isSame(this.vitalsStartDate, 'month'))
        this.disableDecrease = true;
      if (moment(this.monthDate).isSame(this.vitalsEndDate, 'month')) {
        this.disableIncrease = true;
      }
    }
    if (this.displayBy == 'year') {
      if (moment(this.yearDate).isSame(this.vitalsStartDate, 'year')) {
        this.disableDecrease = true;
      }
      if (moment(this.yearDate).isSame(this.vitalsEndDate, 'year')) {
        this.disableIncrease = true;
      }
    }
  }

  reduceDateRange() {
    this.disableIncrease = false;
    if (this.displayBy == 'day') {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'days').toString();
    }
    else if (this.displayBy == 'week') {
      this.weekStartDate = moment(this.weekStartDate).subtract(7, 'days').toString();
      this.weekEndDate = moment(this.weekEndDate).subtract(7, 'days').toString();
    }
    else if (this.displayBy == 'month') {
      this.monthDate = moment(this.monthDate).subtract(1, 'month').toString();
    }
    else if (this.displayBy == 'year') {
      this.yearDate = moment(this.yearDate).subtract(1, 'year').toString();
    }
    if (this.displayBy != 'day') {
      this.setDateRangeControls();
      this.setChartData(true);
    }
  }

  increaseDateRange() {
    this.disableDecrease = false;
    if (this.displayBy == 'day') {
      this.selectedDate = moment(this.selectedDate).add(1, 'days').toString();
    }
    else if (this.displayBy == 'week') {
      this.weekStartDate = moment(this.weekStartDate).add(7, 'days').toString();
      this.weekEndDate = moment(this.weekEndDate).add(7, 'days').toString();
    }
    else if (this.displayBy == 'month') {
      this.monthDate = moment(this.monthDate).add(1, 'month').toString();
    }
    else if (this.displayBy == 'year') {
      this.yearDate = moment(this.yearDate).add(1, 'year').toString();
    }
    if (this.displayBy != 'day') {
      this.setDateRangeControls();
      this.setChartData(true);
    }
  }

  private getTime(date?: Date) {
    let val = date != null ? date.getTime() : 0;
    return val;
  }

  public sortVitalsInAscOrder() {
    if(this.userDetails && this.userDetails.vitals) {
      this.userDetails.vitals.sort((a: Vital, b: Vital) => {
        return this.getTime(new Date(a.submittedDate)) - this.getTime(new Date(b.submittedDate));
      });
    }
  }

  public sortVitalsInDescOrder() {
    if(this.userDetails && this.userDetails.vitals) {
      this.userDetails.vitals.sort((a: Vital, b: Vital) => {
        return this.getTime(new Date(b.submittedDate)) - this.getTime(new Date(a.submittedDate));
      });
    }
  }

  async showVitalsPage() {
    const me = this;
    let formContext = this.formContext;
    formContext.modalName = FORM_MODAL.VITAL;
    formContext.modalAction = MODAL_ACTION.ADD;
    this.session.setFormContext(formContext);

    const modal = await this.modalController.create({
      component: ManageVitalsPage,
      cssClass: 'vital-modal-css'
    });
    modal.onDidDismiss().then((data) => {
        let formContext = this.formContext;
        formContext.modalName = undefined;
        formContext.modalAction = undefined;
        this.session.setFormContext(formContext);
      });

    return await modal.present();
  }

}