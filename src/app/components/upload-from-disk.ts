import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {YouTubeUploadComponent} from './youtube-upload';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'va-upload-disk-layout',
  template: `
    <div fxLayout="column">
      <div *ngIf="!this.videoSelect" fxLayout="column" fxLayoutGap="30px" fxFlex="60%">
        <h1>Select a video from your computer to upload</h1>
        <div fxLayoutAlign="center center" style="margin-top: 20px" fxLayout="row">

          <input type="file" #videoFile name="video" accept="video/*" (change)="videoSelected($event)" hidden>
          <button mat-raised-button color="accent" (click)="pickfile()">
            <mat-icon>add</mat-icon>
            <strong>Select</strong></button>
        </div>
      </div>
      <div [hidden]="!videoSelect">
        <div id="root" fxLayoutAlign="center center">
          <video #video width="640" controls>
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div fxLayoutAlign="center center" fxLayoutGap="10px">
          <button mat-raised-button color="accent" (click)="submit()">Upload</button>
          <input type="file" #videoFile name="video" accept="video/*" (change)="videoSelected($event)" hidden>
          <button mat-raised-button color="primary" (click)="pickfile()">
            <mat-icon>cached</mat-icon>
            <strong>Change Video</strong></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #root {
      height: 360px;
      width: 640px;
      border: 1px solid black;
      margin: 20px 0;
    }

    video {
      height: 100%;
    }
    
    button {
      margin-bottom: 5px;
    }

  `]
})
export class UploadFromDiskComponent {
  @ViewChild('videoFile') nativeInputFile: ElementRef;
  @ViewChild('video') video: any;
  @Input() redirectUrl: string;
  videoSelect = false;
  file: File;

  constructor(public dialog: MatDialog) {
  }

  videoSelected(event) {
    this.videoSelect = true;
    this.file = event.srcElement.files[0];
    this.video.nativeElement.src = window.URL.createObjectURL(this.file);
  }

  pickfile() {
    this.nativeInputFile.nativeElement.click();
  }

  submit() {
    this.dialog.open(YouTubeUploadComponent, {
      data: {video: this.file, redirectTo: this.redirectUrl}
    });
  }
}

