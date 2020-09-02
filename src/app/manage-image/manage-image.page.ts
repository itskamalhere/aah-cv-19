import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform, Dimensions } from 'ngx-image-cropper';
import { ModalController, Platform, LoadingController, IonSlides, IonTextarea } from '@ionic/angular';
import { Conv,File, ConvData } from '../model/user-model';
import * as moment from 'moment';
import { SessionService } from '../services/session.service';
import { FirebaseService } from '../services/firebase.service';
import { Plugins } from '@capacitor/core';
const { StatusBar } = Plugins;

@Component({
  selector: 'app-manage-image',
  templateUrl: './manage-image.page.html',
  styleUrls: ['./manage-image.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ManageImagePage implements OnInit {
  cropperInitWidth: number = 350;
  cropperInitHeight: number = 600;
  cropperWidth: number = 350;
  cropperHeight: number = 600;
  convMessage: string = "";
  viewHeight: number;
  potraightHeight: number;
  landscapeHeight: number;
  viewMode: boolean = false;
  userId: string;
  action: string;
  convData: ConvData;
  image: any;
  croppedImage: any;
  canvasRotation = 0;
  transform: ImageTransform = {};
  editImage: boolean = false;
  @ViewChild(ImageCropperComponent, { static: false }) imageCropper: ImageCropperComponent;
  @ViewChild(IonSlides, { static: false }) slider: IonSlides;
  @ViewChild(IonTextarea, { static: false }) textArea: IonTextarea;
  sliderOpt = {
    pager: true,
    speed: 200,
    zoom: {
      maxRatio: 2
    }
  };

  constructor(
    public session: SessionService,
    public modalController: ModalController,
    public platform: Platform,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController    
    ) {}

  ngOnInit() {
    if(this.session.isHybrid()) {
      StatusBar.setBackgroundColor({ color: "#000000" });
      //StatusBar.hide();
      // StatusBar.setOverlaysWebView({
      //   overlay: true
      // });
    }
    this.viewMode = this.action&&this.action=="view"?true:false;
    this.croppedImage = this.image;
    if(this.platform.isPortrait) {
      this.viewHeight = this.potraightHeight;
    } else if(this.platform.isLandscape) {
      this.viewHeight = this.landscapeHeight;
    }
    this.platform.resize.subscribe(() => {
      if(this.platform.isPortrait()) {
        this.viewHeight = this.potraightHeight;
      } else if(this.platform.isLandscape()) {
        this.viewHeight = this.landscapeHeight;
      }
    });
  }

  ionViewDidEnter() {
    if(this.slider) {
      this.slider.update();
    }    
    if(this.textArea) {
      this.textArea.autoGrow = true;
    }
  }

  async addAttachment() {
    await this.presentLoading();
    let file = {} as File;
    file.userId = this.userId;
    file.name = `discussion_${new Date().getTime()}.jpeg`;
    file.data = this.croppedImage?this.croppedImage:this.image;
    file.contentType = "image/jpeg";    
    this.firebaseService.uploadFile(file).then((url) => {      
      this.addDiscussion(file,url);
    }).catch(error => {
      console.log(error);
      this.loadingController.dismiss();
      alert(error);
    });
  }

  addDiscussion(file: File, url: string) {
    let conversation = {} as Conv;
    const timeStamp = moment().toISOString();
    const creator = this.session.getUser();
    if(this.convMessage && this.convMessage.trim().length > 0) {
      conversation.message = this.convMessage;
    }
    conversation.convType = "discussion";
    conversation.creationDate = timeStamp;
    conversation.modifyDate = timeStamp;
    conversation.creatorId = creator.id;
    conversation.creatorName = creator.data.firstName + " " + creator.data.lastName;
    conversation.creatorType = creator.data.userType;
    conversation.attachmentName = file.name;
    conversation.attachmentUrl = url;
    conversation.attachmentContentType = file.contentType;
    this.firebaseService.addConversation(this.userId,conversation).then(() => {
      this.convMessage = "";
      this.loadingController.dismiss();
      this.modalController.dismiss({saved:true});
    }).catch(error => {
      console.log(error);
      this.loadingController.dismiss();
      alert(error);
    });
  }

  async presentLoading() {
    let loading = await this.loadingController.create({
      message: "Saving..."
    });
    await loading.present();
  }

  cropImage() {    
    this.croppedImage = this.imageCropper.crop().base64;    
    this.editImage = false;
    if(this.slider) {
      this.slider.update();
    }
  }

  rotateImage() {
    // this.flipSides();
    // let rotation = this.transform.rotate;
    // if(!rotation) {
    //   rotation = -90;
    // } else {
    //   rotation = rotation-90;
    // }
    // this.transform = {
    //   ...this.transform,
    //   rotate: rotation
    // };
    this.canvasRotation--;
  }

  flipSides() {
    if(this.cropperWidth == this.cropperInitWidth) {
      this.cropperWidth = this.cropperInitHeight;
    } else {
      this.cropperWidth = this.cropperInitWidth;
    }
    if(this.cropperHeight == this.cropperInitHeight){
      this.cropperHeight = this.cropperInitWidth;
    } else {
      this.cropperHeight = this.cropperInitHeight;
    }
    document.documentElement.style.setProperty('--canvas-img-width',this.cropperWidth+"px");
    document.documentElement.style.setProperty('--canvas-img-height',this.cropperHeight+"px");
  }

  imageCropped(event: ImageCroppedEvent) {    
    this.croppedImage = event.base64;
  }

  cropperReady(event: Dimensions) {
    console.log(event.width);
    console.log(event.height);
    // this.cropperInitWidth = event.width;
    // this.cropperInitHeight = event.height;    
  }

  close() {
    this.modalController.dismiss({saved:false});
  }

}
