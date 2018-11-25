import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
declare var annyang: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent implements OnInit {
  constructor(){
   
  }
 

  public message = '';
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
     width: {ideal: 1024},
     height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });

      console.log(annyang);
      var commands:any = {
        'hello':()=>{alert('Hello World')},
        'turn on camera':()=>{let element = document.getElementById('startCamera') as HTMLElement; element.click();},
        'turn off camera': ()=>{let element = document.getElementById('stopCamera') as HTMLElement; element.click();},
        'take a picture':()=>{let element = document.getElementById('takeASnapshot') as HTMLElement; element.click();},
        'click me':()=>{let element = document.getElementById('clickMe') as HTMLElement; element.click();}


      }
      annyang.addCommands(commands);
      annyang.start();
    

  }
  clickMe(){
    this.message = 'I am clicked';
    console.log(this.message);
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  startCamera(){
    console.log("Starting Camera");
    setTimeout(()=>{

      this.showWebcam = true;
      console.log(this.showWebcam);
    })
  }
  stopCamera(){
    console.log("Stopping Camera");
    setTimeout(()=>{
      this.showWebcam = false;
    })
    console.log(this.showWebcam);
  }
}
