import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import * as RecordRTC from 'recordrtc';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {YouTubeUploadComponent} from './youtube-upload';


@Component({
  selector: 'va-record-webcam-layout',
  template: `
    <div id="root" fxLayoutAlign="center center">
      <span class="countdown" *ngIf="step === RecordingStep.COUNTDOWN">{{counter}}</span>
      <video [hidden]="step === RecordingStep.COUNTDOWN" #video
             class="video"></video>
      <img class="indicator" fxFlex="0 0 auto" *ngIf="step === RecordingStep.RECORDING"
           src="/assets/images/recording.gif"/>
    </div>
    <h2 *ngIf="step === RecordingStep.INIT">Position yourself infront of webcam and start recording when ready</h2>
    <button *ngIf="step === RecordingStep.INIT" mat-raised-button color="accent" (click)="startCountdown()">Start
      Recording
    </button>
    <button *ngIf="step === RecordingStep.RECORDING" mat-raised-button color="primary" (click)="stopRecording()">Stop
      Recording
    </button>
    <div *ngIf="step === RecordingStep.RECORDED" fxLayoutAlign="center center" fxLayoutGap="10px">
      <button mat-raised-button color="accent" (click)="upload()">Upload</button>
      <button mat-raised-button color="primary" (click)="download()">Download</button>
      <button mat-raised-button color="primary" (click)="reset()">Re record</button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #root {
      position: relative;
      height: 360px;
      width: 640px;
      border: 1px solid black;
      margin: 20px 0;
    }

    video {
      height: 100%;
    }

    .countdown {
      font-size: 80px;
      font-weight: bolder;
    }

    button {
      margin-bottom: 5px;
    }

    .indicator {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  `]
})
export class RecordWebcamComponent implements AfterViewInit, OnDestroy {

  private stream: MediaStream;
  private recordRTC: any;
  @Input() redirectUrl: string;
  @ViewChild('video') video: any;
  step: RecordingStep;
  counter = 0;
  RecordingStep: any = RecordingStep;

  _active: boolean;

  @Input()
  set active(active: boolean) {
    console.log('active is ' + active);
    this._active = active;

    if (active && this.step === RecordingStep.INIT) {
      this.startWebcam();
    } else if (!active && this.step) {
      setTimeout(() => {
        this.stopRecording();
        if (this.step < RecordingStep.RECORDING) {
          this.step = this.RecordingStep.INIT;
        }
      }, 1000);
    }
  }

  get active(): boolean {
    return this._active;
  }

  constructor(public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.reset();
  }

  reset() {
    this.step = RecordingStep.INIT;
    if (this.active) {
      this.startWebcam();
    }
  }

  startCountdown() {
    this.counter = 3;
    this.step = RecordingStep.COUNTDOWN;
    Observable.interval(500).take(4).takeWhile(() => this.active).map(x => 3 - x).subscribe(x => {
      this.counter = x;
      if (x === 0) {
        this.startRecording();
      }
    });
  }

  startWebcam() {
    const mediaConstraints: MediaStreamConstraints = {
      video: {
        width: 1280,
        height: 720
      },
      audio: true
    };

    navigator
      .mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopWebcam() {
    if (!this.stream) {
      return;
    }
    this.stream.getAudioTracks().forEach(track => track.stop());
    this.stream.getVideoTracks().forEach(track => track.stop());
  }

  successCallback(stream: MediaStream) {
    this.stream = stream;
    const video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.hideControls();
  }

  errorCallback(error) {
    console.log(error);
  }

  showControls() {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  hideControls() {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.muted = true;
    video.controls = false;
    video.autoplay = true;
  }

  startRecording() {
    this.step = RecordingStep.RECORDING;
    const options = {
      mimeType: 'video/webm',
      audioBitsPerSecond: 256000,
      videoBitsPerSecond: 750000
    };
    this.recordRTC = RecordRTC(this.stream, options);
    this.recordRTC.startRecording();
  }

  stopRecording() {
    if (this.recordRTC) {
      this.step = RecordingStep.RECORDED;
      this.recordRTC.stopRecording(this.processVideo.bind(this));
    }
    this.stopWebcam();
  }

  processVideo(audioVideoWebMURL) {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.src = audioVideoWebMURL;
    this.showControls();
  }

  upload() {
    this.dialog.open(YouTubeUploadComponent, {
      data: {video: this.recordRTC.getBlob(), redirectTo: this.redirectUrl}
    });
  }

  download() {
    this.recordRTC.save('video.webm');
  }

  ngOnDestroy() {
    if (this.step === RecordingStep.RECORDING) {
      this.stopRecording();
    }
  }

}

enum RecordingStep {
  INIT = 1,
  COUNTDOWN,
  RECORDING,
  RECORDED
}
