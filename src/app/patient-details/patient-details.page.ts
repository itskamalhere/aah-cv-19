import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TimeScale } from 'chart.js';
import { ModalController, Platform, AlertController, LoadingController, IonContent, ToastController } from '@ionic/angular';
import { ManageVitalsPage } from '../manage-vitals/manage-vitals.page';
import { ChartConfig, VitalsConfig, DAY_TIMESCALE, WEEK_TIMESCALE, MONTH_TIMESCALE, YEAR_TIMESCALE } from './chart-interface';
import * as moment from 'moment';
import { FormContext, SessionService, MODAL_ACTION, FORM_MODAL, FORM_ACTION } from '../services/session.service';
import { Subscription } from 'rxjs';
import { Vital, User, UserData, ConvData, Conv } from '../model/user-model';
import { FirebaseService } from '../services/firebase.service';
import { UserManagePage } from '../user-manage/user-manage.page';
import * as Chart from 'chart.js';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Plugins, StatusBarStyle, CameraResultType, CameraSource } from '@capacitor/core';
import { ManageImagePage } from '../manage-image/manage-image.page';
import { first } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Color } from 'ng2-charts';

const { App,Camera,StatusBar } = Plugins;

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss']
})

export class PatientDetailsPage implements OnInit, OnDestroy {  
  multiDataChartColors: Color[];
  sessionUser: User;
  sessionUserName: string;
  overlay: any;  
  convMessage: string = "";
  source = CameraSource;
  formContext: FormContext;
  user: User;
  userData: UserData;
  convData: ConvData;
  userSub: Subscription;
  discussionSub: Subscription;
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
  convLoaded: boolean = false;
  discussionAdded: boolean = false;
  subscribed: boolean = false;
  chartPrimary: string;
  chartSecondary: string;
  potraightInitHeight: number;
  landscapeInitHeight: number;
  potraightHeight: number;
  landscapeHeight: number;
  @ViewChild(IonContent) private content: IonContent;

  constructor(
    public session: SessionService,
    private firebaseService: FirebaseService,
    public modalController: ModalController,
    private appPreferences: AppPreferences,
    private firebase: FirebaseX,
    public platform: Platform,
    private alertController: AlertController,
    private location: Location,
    private loadingController: LoadingController,
    private toastController: ToastController,    
    private functions: AngularFireFunctions
    ) {
    this.chartPrimary = "#8d4d9a";
    this.chartSecondary = "rgba(141, 77, 154, 0.5)";
    this.multiDataChartColors = [
      {
        borderColor: '#000000',
        backgroundColor: this.chartSecondary,
        hoverBackgroundColor: "white"
      },
      {
        borderColor: '#000000',
        backgroundColor: this.chartPrimary,
        hoverBackgroundColor: "white"
      }];
    this.formContext = this.session.getFormContext();
    this.sessionUser = this.session.getUser();
    this.sessionUserName = this.sessionUser.data.firstName + " " + this.sessionUser.data.lastName;
    if(this.sessionUser && this.sessionUser.data && this.sessionUser.data.userType == "Patient") {
      this.formContext.user = this.sessionUser;
      this.session.setFormContext(this.formContext);
      if(this.session.isHybrid() && !this.subscribed) {
        let topics = [];
        let role = this.sessionUser.data.role.path.toString();
        role = role.substring(role.lastIndexOf("/")+1);
        let userType = this.sessionUser.data.userType;
        topics.push(role);
        topics.push(userType);
        this.subscribeTopics(topics);
      }      
    }
    Chart.defaults.global.defaultFontFamily = 'OpenSans';
    Chart.defaults.global.defaultFontColor = 'black';
    this.user = {} as User;
    this.userData = {} as UserData;
    this.convData = {} as ConvData;
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
    if(this.sessionUser && this.sessionUser.data && this.sessionUser.data.userType == "Patient") {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        App.exitApp();
      });
    }
    if(this.platform.isPortrait) {
      this.potraightInitHeight = this.platform.height();
      this.landscapeInitHeight = this.platform.width();
      this.potraightHeight = this.potraightInitHeight;
      this.landscapeHeight = this.landscapeInitHeight;
    } else if(this.platform.isLandscape) {
      this.potraightInitHeight = this.platform.width();
      this.landscapeInitHeight = this.platform.height();
      this.potraightHeight = this.potraightInitHeight;
      this.landscapeHeight = this.landscapeInitHeight;
    }
    this.platform.resize.subscribe(() => {
      if(this.platform.isPortrait()) {
        this.potraightHeight = this.potraightInitHeight;
        this.landscapeHeight = this.landscapeInitHeight;
      } else if(this.platform.isLandscape()) {
        this.potraightHeight = this.landscapeInitHeight;
        this.landscapeHeight = this.potraightInitHeight;
      }
    });
  }

  segmentChanged(ev: any) {
    const segment = ev.detail.value;
    if(this.convLoaded && segment == "discussions") {
      setTimeout(() => this.content.scrollToBottom(), 100);
    } else {
      setTimeout(() => this.content.scrollToTop(), 100);
    }
    if(segment == "discussions" && !this.convLoaded) {
      this.discussionSub = this.firebaseService.fetchConversations(this.formContext.user.id).subscribe(conversation => {
        if(conversation && conversation.data) {
          let conversations = conversation.data.conversations.filter(a => a.convType == "discussion");
          this.convData.conversations = conversations;
        }
        if((segment == "discussions") && ((!this.convLoaded && !this.discussionAdded) || this.discussionAdded)) {
          this.discussionAdded = false;
          setTimeout(() => this.content.scrollToBottom(), 100);
        } else if(this.sessionUser.data.userType == "Staff") {
          const length = this.convData.conversations.length-1;
          const lastMessageCreator = this.convData.conversations[length].creatorName;
          if(this.sessionUserName != lastMessageCreator) {
            this.showNewDiscussion();
          }
        }
        this.convLoaded = true;
      });
    }
  }

  async showNewDiscussion() {
    if(this.overlay) {
      this.overlay.dismiss();
    }
    this.overlay = await this.toastController.create({
      header: 'New discussion added',
      position: "bottom",
      animated: true,
      color: "primary",
      duration: 3000,
      buttons: [
        {
          icon: this.segment=="discussions"?"arrow-down":"",
          role: "cancel",
          handler: () => {
            if(this.segment=="discussions") {
              setTimeout(() => this.content.scrollToBottom(), 100);
            }            
          }
        }
      ]
    });
    this.overlay.present();
  }

  async addImage(source: CameraSource) {    
    try{
      const me = this;
      let image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        webUseInput: true,
        source
      });

      if(!me.session.isModalCalled()) {
        me.session.setModalCalled(true);
        await me.openImageModal(image.dataUrl,"upload");
      }
    } catch(error) {
      console.log(error);
    }
  }

  openImage(attachmentUrl: string) {
    this.openImageModal(attachmentUrl,"view");
  }

  async openImageModal(imageUrl: any, action: string) {
    let modal = await this.modalController.create({
      id: new Date().getTime().toString(),
      component: ManageImagePage,
      animated: action=="view"?true:false,
      componentProps: {
        action: action,
        //convData: this.convData,
        image: imageUrl,        
        userId: this.formContext.user.id,
        potraightHeight: this.potraightHeight,
        landscapeHeight: this.landscapeHeight
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(args=>{
      if(this.session.isHybrid()) {
      // StatusBar.setOverlaysWebView({
      //   overlay: false
      // });
      StatusBar.setBackgroundColor({ color: "#ffffff" });
      // StatusBar.setStyle({ style: StatusBarStyle.Light });
      // StatusBar.show();
      }
      this.session.setModalCalled(false);
      if(args && args.data){
        const saved: boolean = args.data.saved;
        if(saved && this.segment == "discussions") {
          this.discussionAdded = true;
          setTimeout(() => this.content.scrollToBottom(), 100);
          this.notifyUsers();
        }
      }
    });
  }

  async notifyUsers() {
    var id = this.formContext.user.id;
    var uhid = this.formContext.user.data.uhid;
    var firstName = this.formContext.user.data.firstName;
    var lastName = this.formContext.user.data.lastName;
    var fullName = firstName+" "+lastName;
    this.functions.httpsCallable("entryAdded")(
      {id:id,uhid:uhid,fullName:fullName,entryName:"Discussion"}).pipe(first())
    .subscribe(resp => {
      console.log({ resp });      
    }, err => {
      console.error({ err });      
    });
  }

  canPreview(conv: Conv): boolean {    
    let canPreview = false;
    if(conv.attachmentUrl && conv.attachmentContentType) {
      if(conv.attachmentContentType.indexOf("image/png") > -1) {
        canPreview = true;
      } else if(conv.attachmentContentType.indexOf("image/bmp") > -1) {
        canPreview = true;
      } else if(conv.attachmentContentType.indexOf("image/jpg") > -1) {
        canPreview = true;
      } else if(conv.attachmentContentType.indexOf("image/jpeg") > -1) {
        canPreview = true;        
      } else if(conv.attachmentContentType.indexOf("image/gif") > -1) {
        canPreview = true;        
      } else if(conv.attachmentContentType.indexOf("image/svg") > -1) {
        canPreview = true;        
      }
    }
    return canPreview;
  }

  addDiscussion() {
    this.discussionAdded = true;
    let conversation = {} as Conv;
    const timeStamp = moment().toISOString();
    const creator = this.sessionUser;    
    if(this.convMessage && this.convMessage.trim().length > 0) {
      conversation.message = this.convMessage;
    }
    conversation.convType = "discussion";
    conversation.creationDate = timeStamp;
    conversation.modifyDate = timeStamp;
    conversation.creatorId = creator.id;
    conversation.creatorName = this.sessionUserName;
    conversation.creatorType = creator.data.userType;
    this.firebaseService.addConversation(this.formContext.user.id,conversation).then(() => {
      this.convMessage = "";      
      this.notifyUsers();
    });
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

  async editUser() {
    let formContext = this.formContext;
    formContext.action = FORM_ACTION.EDIT;
    this.session.setFormContext(formContext);
    let modal = await this.modalController.create({
      component: UserManagePage
    });
    return await modal.present();
  }

  async deleteUser() {
    let alertCtrl = await this.alertController.create({
      header: "Delete record. Are you sure?",
      message: "This will permanently delete the record and any vitals/other related information",
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'          
        }, {
          text: 'Ok',
          handler: async () => {
            await this.presentLoading("Deleting...");
            if(this.discussionSub) {
              this.discussionSub.unsubscribe();
            }
            if(this.userSub) {
              this.userSub.unsubscribe();
              this.firebaseService.deleteUser(this.formContext.user.id).then(() => {
                this.loadingController.dismiss();
                this.location.back();
              },function(err) {
                console.log("error: " + err);
                this.loadingController.dismiss();
                alert(err);
              });
            }
          }
        }
      ]
    });
    await alertCtrl.present();
  }

  async presentLoading(message: string) {
    let loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }

  ngOnDestroy() {
    if(this.discussionSub) {
      this.discussionSub.unsubscribe();
    }
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getCssAttribute(attribName: string): string {    
    //return window.getComputedStyle(document.body).getPropertyValue("--"+attribName);
    return document.documentElement.style.getPropertyValue("--"+attribName);
  }

  initializeChartConfig() {
    const me = this;
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
          backgroundColor: this.chartPrimary,
          hoverBackgroundColor: "white"
        }
      ],
        showLegend: true
      }
      sampleChartConfig.id = vital.id;
      let idVals = vital.id;
      if (idVals.includes("|")) {
        sampleChartConfig.chartColors = this.multiDataChartColors;
        let idValArr = idVals.split("|");
        let indexPos = 0;
        let labelVals = vital.label.split("|");
        for (let idVal of idValArr) {
          sampleChartConfig.chartData[indexPos] = { data: [], label: labelVals[indexPos], borderWidth: 1, pointHitRadius: 15 }
          indexPos++;
        }
      } else {
        sampleChartConfig.chartData = [{ data: [], label: vital.label, borderWidth: 1, pointHitRadius: 15 }];
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
    if (initialize) {
      this.initializeChartConfig();
    }
    let vitalsOnSelectedDate = this.getVitalsData();
    if (this.vitalsChartConfigs) {
      for (let chartConfig of this.vitalsChartConfigs) {
        let idVals = chartConfig.id;
        chartConfig.chartLabels = [this.fromDateVal.toString(), this.toDateVal.toString()];
        if (idVals.includes("|")) {
          let dataSetValues: number[] = [];
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
                dataSetValues.push(vitalOnSelectedDate[idVal]);
                chartConfig.chartData[indexPos].data.push(vitalOnSelectedDate[idVal]);
              }
              indexPos++;
            }
          }
          let chartIndex = 0;
          for (let idVal of idValArr) {
            this.updateMaxLimitInChart(dataSetValues, chartConfig, chartIndex);
            chartIndex++;
          }
        } else {
          chartConfig.chartData[0].data = [null, null];
          let dataSetValues: number[] = [];
          for (let vitalOnSelectedDate of vitalsOnSelectedDate) {
            if (vitalOnSelectedDate[chartConfig.id] != undefined &&
              vitalOnSelectedDate[chartConfig.id] != "" && vitalOnSelectedDate[chartConfig.id] != 0) {
              dataSetValues.push(vitalOnSelectedDate[chartConfig.id]);
              chartConfig.chartLabels.push(vitalOnSelectedDate.submittedDate.toString());
              chartConfig.chartData[0].data.push(vitalOnSelectedDate[chartConfig.id]);
            }
          }
          this.updateMaxLimitInChart(dataSetValues, chartConfig, 0);
        }
      }
    }
  }

  updateMaxLimitInChart(dataSetValues: number[], chartConfig: ChartConfig, index: number) {
    if (dataSetValues.length > 0) {
      let actualMinVal = chartConfig.chartOptions.scales.yAxes[index].ticks.min;
      let actualMaxVal = chartConfig.chartOptions.scales.yAxes[index].ticks.max;
      let actualStepSizeVal = chartConfig.chartOptions.scales.yAxes[index].ticks.stepSize;
      let maxValueInDataSet = Math.max(...dataSetValues);
      let modMaxVal = maxValueInDataSet + (0.25 * actualStepSizeVal);
      let modStepSize = Math.ceil(((modMaxVal - actualMinVal) / 4) / actualStepSizeVal) * actualStepSizeVal;
      chartConfig.chartOptions.scales.yAxes[index].ticks.max = Math.ceil(modMaxVal / actualStepSizeVal) * actualStepSizeVal;
      chartConfig.chartOptions.scales.yAxes[index].ticks.stepSize = modStepSize;

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