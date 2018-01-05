import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {getVideo, State} from '../reducers';
import {Store} from '@ngrx/store';
import {Video} from '../models/video';
import {environment} from '../../environments/environment';
import {VaetasService} from '../services/vaetas';
import {MatSnackBar} from '@angular/material';
import {AlertService} from "../services/alert";

@Component({
  selector: 'va-edit-video',
  template: `
    <div style="margin: 20px" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="25px">
      <mat-card>
        <iframe #videoView width="720" height="360">
        </iframe>
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="15px" style="width: 750px">
          <h2 style="width: 720px" #title [attr.contenteditable]="isTitleEditable"></h2>
          <mat-spinner *ngIf="titleLoading" style="width: 38px;float: right" color="accent" ></mat-spinner>
          <div *ngIf="!titleLoading">
            <button [disabled]="isUploading" *ngIf="!isTitleEditable" mat-mini-fab (click)="titleEdit(!isTitleEditable)">
              <mat-icon *ngIf="!isTitleEditable">mode_edit</mat-icon>
            </button>
            <button [disabled]="isUploading" mat-mini-fab *ngIf="isTitleEditable" style="background-color: #30f330"
                    (click)="titleEdit(!isTitleEditable)">
              <mat-icon>check</mat-icon>
            </button>
          </div>
        </div>
        <div style="width: 750px" fxLayout="row" fxLayoutAlign="start start" fxLayoutGap="8px">
          <h4 style="width: 720px" #desc [attr.contenteditable]="isDescrEditable"></h4>
          <mat-spinner *ngIf="descLoading" style="width: 38px;float: right" color="accent" ></mat-spinner>

          <div *ngIf="!descLoading">
            <button [disabled]="isUploading" style="float: right" *ngIf="!isDescrEditable" mat-mini-fab
                    (click)="descrEdit(!isDescrEditable)">
              <mat-icon>mode_edit</mat-icon>
            </button>
            <button [disabled]="isUploading" style="float: right" mat-mini-fab *ngIf="isDescrEditable"
                    style="background-color: #30f330"
                    (click)="descrEdit(!isDescrEditable)">
              <mat-icon>check</mat-icon>
            </button>
          </div>
        </div>
      </mat-card>
    </div>`,
  styles: [``]
})


export class EditVideoComponent implements OnInit, OnDestroy {
  titleLoading: boolean = false;
  descLoading: boolean = false;
  isUploading: boolean = false;
  isTitleEditable: boolean = false;
  isDescrEditable: boolean = false;
  private alive = true;
  @ViewChild('videoView') videoView;
  @ViewChild('title') title;
  @ViewChild('desc') desc;
  video: Video;
  titleText;
  descText;


  constructor(private alertService: AlertService, private service: VaetasService, private route: ActivatedRoute, private store: Store<State>) {
  }

  ngOnInit() {
    this.route.params.map(params => params['id'])
      .switchMap((id) => this.store.select((state) => getVideo(state, id)))
      .subscribe((video) => {
        this.video = video;
        this.videoView.nativeElement.src = environment.videoBaseUrl + this.video.namespace;
        this.title.nativeElement.innerHTML = this.video.title;
        this.desc.nativeElement.innerHTML = this.video.description;
      });
  }

  ngOnDestroy() {
    this.alive = false;

  }

  titleEdit(value: boolean) {
    this.isTitleEditable = value;
    if (!value) {
      this.titleLoading = true;
      this.titleText = this.title.nativeElement.innerHTML;
      this.updateVideo();
    }
  }

  descrEdit(value: boolean) {
    this.isDescrEditable = value;
    if (!value) {
      this.descLoading = true;
      this.descText = this.desc.nativeElement.innerHTML;
      this.updateVideo();
    }
  }

  updateVideo() {
    this.isUploading = true;
    console.log(this.route.snapshot.params.id);
    this.service.updateVideo(this.route.snapshot.params.id, {
      title: this.titleText,
      description: this.descText
    }).subscribe((video) => {
      this.alertService.success('Video Updated');
        this.descLoading = false;
        this.titleLoading = false;
        this.isUploading = false;
      }, (error) => {
      this.alertService.error(error.message);
        this.descLoading = false;
        this.titleLoading = false;
        this.isUploading = false;
      }
    );

  }
}
