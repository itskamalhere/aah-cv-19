import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    public uuid: string;
    public authSuccess: boolean = false;
    public authStatus: string = "Pending Authentication";
    public authError: string = "";
    constructor(private biometric: FingerprintAIO) { }

    async doAuthentication() {
        try{
        const info = await Device.getInfo();
        this.uuid = info.uuid;
        const me = this;
        this.biometric.isAvailable().then(function(result) {
            console.log("result:"+result);
            me.biometric.show({
                title: 'Biometric Authentication',
                description: 'Continue with biometric authentication',
                fallbackButtonTitle: 'Use Backup',
                disableBackup:false
            })
            .then((result: any) => {
                me.authSuccess = true;
                me.authStatus = "Authentication successful";
                console.log("Auth success:"+result); //biometric_success                
            })
            .catch((error: any) => {
                me.authSuccess = false;
                me.authStatus = "Authentication failed";
                me.authError = error.message;
                console.log("Auth error:"+error.message);
            });
        }, function(error) {
            me.authSuccess = false;
            me.authStatus = "Authentication failed";
            me.authError = error.message;
            console.log("error:"+error.code+":"+error.message);            
            if(error && (Number(error.code) == me.biometric.BIOMETRIC_NOT_ENROLLED) || (Number(error.code) == me.biometric.BIOMETRIC_SCREEN_GUARD_UNSECURED)){
            alert("Enable biometric authentication in this device to proceed");
            }
        });
        }catch(err){
        console.log(err);
        }
    }
}