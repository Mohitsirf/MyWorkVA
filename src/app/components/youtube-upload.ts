import {Component, Inject, OnInit} from '@angular/core';
import {YoutubeService} from '../services/youtube';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {VaetasService} from '../services/vaetas';
import Utils from '../utils';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'va-youtube-upload',
  template: `
    <div *ngIf="youtubeService.profile$ | async as profile">
      <span>Connected Youtube Account: <strong>{{profile.getEmail()}}</strong></span>
      <span class="change" *ngIf="youtubeService.isAuthInit$ | async"
            (click)="youtubeService.signIn()">change account</span>
      <hr>
    </div>
    <form *ngIf="(youtubeService.profile$ | async) && !importing && !importFailedError" fxLayout="column"
          fxLayoutAlign="center stretch"
          fxFlexAlign="center" fxLayoutGap="10px"
          [formGroup]="videoForm" (ngSubmit)="videoForm.valid && onSubmit()" novalidate>
      <mat-form-field style="width: 100%">
        <input matInput placeholder="Title of video" formControlName="title">
        <mat-error>Title is required</mat-error>
      </mat-form-field>
      <mat-form-field style="width: 100%">
        <textarea matInput placeholder="Description of video (optional)" formControlName="description"></textarea>
      </mat-form-field>
      <div fxLayout="row" fxLayoutAlign="start center" *ngIf="loading">
        <mat-progress-bar
          color="accent"
          [value]="percentUploaded"
          [bufferValue]="100">
        </mat-progress-bar>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>cancel</mat-icon>
        </button>
      </div>
      <button mat-raised-button fxFlexAlign="end" *ngIf="!loading" color="accent">Upload</button>
    </form>

    <div fxLayout="column" fxLayoutAlign="start center"
         *ngIf="(youtubeService.isAuthInit$ | async ) && !(youtubeService.isSignedIn$ | async)">
      <h2>Please (re)connect your youtube account to upload the video</h2>
      <button mat-raised-button (click)="youtubeService.signIn()" color="accent">Connect YouTube account</button>
    </div>
    <div *ngIf="importing" fxLayoutAlign="center start">
      <mat-spinner color="accent"></mat-spinner>
    </div>

    <div *ngIf="importFailedError" fxLayout="column" fxLayoutAlign="start center">
      <h2>Video uploaded to YouTube successfully but import to Vaetas failed with error:</h2>
      <h4>{{importFailedError}}</h4>
      <button mat-raised-button color="accent" (click)="importVideo()">Try Importing Again</button>
    </div>
  `,
  styles: [`
    .change {
      text-decoration: underline;
      color: #a7d2f0;
      cursor: pointer;
    }
  `]
})

export class YouTubeUploadComponent implements OnInit {
  videoForm: FormGroup;
  loading = false;
  percentUploaded = 0;
  subscription: Subscription;
  importFailedError: string = null;
  videoUrl: string;
  importing = false;


  constructor(private youtubeService: YoutubeService,
              private vaetasService: VaetasService,
              @Inject(MAT_DIALOG_DATA) private data: { video: any, redirectTo: string },
              private dialogRef: MatDialogRef<YouTubeUploadComponent>,
              private alertService: AlertService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.videoForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl()
    });
  }

  onSubmit() {
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.subscription = this.youtubeService.uploadVideo(this.data.video, this.videoForm.value).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentUploaded = Math.round(100 * event.loaded / event.total);
          // limit progress to 90 as we consider it 100% complete once video is imported to Vaetas
          this.percentUploaded = Math.min(90, this.percentUploaded);
        } else if (event instanceof HttpResponse) {
          const response: any = event.body;
          this.videoUrl = Utils.getYoutubeUrlFromId(response.id);
          this.importVideo();
        }
      },
      (error) => {
        this.loading = false;
        this.dialogRef.disableClose = false;

        if (error.error instanceof Error) {
          this.alertService.error(error.error.message);
        } else {
          const errorObject = JSON.parse(error.error);
          if (errorObject.error.errors[0].reason === 'youtubeSignupRequired') {
            this.snackBar.open('You need to create a YouTube Channel before you can start uploading videos',
              'Create Channel',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                extraClasses: ['alert-error']
              })
              .onAction().take(1).subscribe(() => window.open('https://www.youtube.com/create_channel',
              '_blank'));
          } else {
            this.alertService.error(errorObject.error.message);
          }
        }
      }
    );
  }

  onCancel() {
    this.subscription.unsubscribe();
    this.loading = false;
    this.dialogRef.close();
  }

  importVideo() {
    this.importing = true;
    this.importFailedError = null;
    this.vaetasService.importVideoByUrl({url: this.videoUrl}).subscribe((resp) => {
      this.loading = false;
      this.alertService.success('Video Imported');
      this.dialogRef.close();
      this.router.navigate([this.data.redirectTo], {queryParams: {video: resp.id}});
    }, error => {
      this.importing = false;
      this.importFailedError = error.message;
    });
  }
}
