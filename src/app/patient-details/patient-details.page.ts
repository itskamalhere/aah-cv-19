import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeScale } from 'chart.js';
import { ModalController, Platform } from '@ionic/angular';
import { ManageVitalsPage } from '../manage-vitals/manage-vitals.page';
import { ChartConfig, VitalsConfig, DAY_TIMESCALE, WEEK_TIMESCALE, MONTH_TIMESCALE, YEAR_TIMESCALE } from './chart-interface';
import * as moment from 'moment';
import { FormContext, SessionService, MODAL_ACTION, FORM_MODAL, FORM_ACTION } from '../services/session.service';
import { Subscription } from 'rxjs';
import { Vital, User, UserData } from '../model/user-model';
import { FirebaseService } from '../services/firebase.service';
import { UserManagePage } from '../user-manage/user-manage.page';
import * as Chart from 'chart.js';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss']
})

export class PatientDetailsPage implements OnInit, OnDestroy {
  formContext: FormContext;
  user: User;
  userData: UserData;
  userSub: Subscription;
  segment = "details";
  displayBy = "day";  
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
  initialized: boolean = false;
  loaded: boolean = false;
  subscribed: boolean = false;

  constructor(
    public session: SessionService,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private appPreferences: AppPreferences,
    private firebase: FirebaseX,
    public platform: Platform
    ) {
    this.formContext = this.session.getFormContext();
    let sessionUser = this.session.getUser();
    if(sessionUser && sessionUser.data && sessionUser.data.userType == "Patient") {
      this.formContext.user = sessionUser;
      this.session.setFormContext(this.formContext);
      if(this.session.isHybrid() && !this.subscribed) {
        let topics = [];
        let role = sessionUser.data.role.path.toString();
        role = role.substring(role.lastIndexOf("/")+1);
        let userType = sessionUser.data.userType;
        topics.push(role);
        topics.push(userType);
        this.subscribeTopics(topics);
      }      
    }
    Chart.defaults.global.defaultFontFamily = 'OpenSans';
    Chart.defaults.global.defaultFontColor = 'black';
    this.user = {} as User;
    this.userData = {} as UserData;
    this.userSub = this.firebaseService.fetchUserbyId$(this.formContext.user.id).subscribe(user => {
      let formContext = this.formContext;
      formContext.user = user;
      this.session.setFormContext(formContext);
      this.user = user;
      this.userData = user.data;
      this.loaded = true;
      if(!this.initialized && this.userData && this.userData.vitals) {
        this.sortVitalsInDescOrder();
        this.initializeVitalsDateRange();
        this.selectedDate = moment(this.vitalsEndDate).format("YYYY-MM-DD").toString();
        this.weekStartDate = moment(this.vitalsEndDate).startOf('day').subtract(6, 'days').toString();
        this.weekEndDate = this.vitalsEndDate;
        this.monthDate = moment(this.vitalsEndDate).startOf('month').toString();
        this.yearDate = moment(this.vitalsEndDate).startOf('year').toString();
        this.setDateRangeControls();
        this.setChartData(true);
        this.initialized = true;
      } else {
        this.sortVitalsInDescOrder();
        this.setChartData(false);
      }
    });
  }

  ngOnInit() {
    let sessionUser = this.session.getUser();
    if(sessionUser && sessionUser.data && sessionUser.data.userType == "Patient") {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        App.exitApp();
      });
    }
  }

  async subscribeTopics(newTopics: string[]) {
    console.log("newTopics");
    console.log(newTopics);
    const me = this;
    this.appPreferences.fetch("topics","topics").then(async (oldTopics) => {
      console.log("oldTopics");
      console.log(oldTopics);
      await this.unSubscribeTopics(oldTopics);
      for(const topic of newTopics) {
        await me.firebase.subscribe(topic);
        console.log("subscribed: "+topic);
      }
      await me.writeTopics(newTopics);
      this.subscribed = true;
    },function(err) {
      console.log("Error: "+err);
    });
  }

  async unSubscribeTopics(oldTopics: string[]) {
    if(oldTopics) {
      for(const topic of oldTopics) {
        await this.firebase.unsubscribe(topic);
        console.log("unsubscribed: "+topic);
      }
    }
  }

  async writeTopics(topics: string[]) {
    this.appPreferences.store("topics","topics",topics).then((res) => {
      console.log("topics written");
    },function(err) {
      console.log("error: " + err);
    });
  }

  async EditUser() {
    let formContext = this.formContext;
    formContext.action = FORM_ACTION.EDIT;
    this.session.setFormContext(formContext);
    let modal = await this.modalController.create({
      component: UserManagePage
    });
    return await modal.present();    
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
          backgroundColor: '#8d4d9a'
        },{
          borderColor: '#000000',
          backgroundColor: 'lightgrey'
        }
      ],
        showLegend: true
      }
      sampleChartConfig.id = vital.id;
      let idVals = vital.id;
      if (idVals.includes("|")) {
        let idValArr = idVals.split("|");
        let indexPos = 0;
        let labelVals = vital.label.split("|");
        for (let idVal of idValArr) {
          sampleChartConfig.chartData[indexPos] = { data: [], label: labelVals[indexPos], borderWidth: 1, pointHitRadius: 25 }
          indexPos++;
        }
      } else {
        sampleChartConfig.chartData = [{ data: [], label: vital.label, borderWidth: 1, pointHitRadius: 25 }];
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
    let allVitals = this.userData.vitals?this.userData.vitals:[];
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
              if (vitalOnSelectedDate[idVal] != undefined && vitalOnSelectedDate[idVal] != "" && vitalOnSelectedDate[idVal] != 0) {
                chartConfig.chartData[indexPos].data.push(vitalOnSelectedDate[idVal]);
              }                
              indexPos++;
            }
          }
        } else {
          chartConfig.chartData[0].data = [null, null];
          for (let vitalOnSelectedDate of vitalsOnSelectedDate) {
            if (vitalOnSelectedDate[chartConfig.id] != undefined &&
               vitalOnSelectedDate[chartConfig.id] != "" && vitalOnSelectedDate[chartConfig.id] != 0) {
              chartConfig.chartLabels.push(vitalOnSelectedDate.submittedDate.toString());
              chartConfig.chartData[0].data.push(vitalOnSelectedDate[chartConfig.id]);
            }
          }
        }
      }
    }
  }

  initializeVitalsDateRange() {    
    let vitalsData = this.userData.vitals;
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
    if(this.userData && this.userData.vitals) {
      this.userData.vitals.sort((a: Vital, b: Vital) => {
        return this.getTime(new Date(a.submittedDate)) - this.getTime(new Date(b.submittedDate));
      });
    }
  }

  public sortVitalsInDescOrder() {
    if(this.userData && this.userData.vitals) {
      this.userData.vitals.sort((a: Vital, b: Vital) => {
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
      component: ManageVitalsPage    
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