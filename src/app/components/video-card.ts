import {Component, Input} from '@angular/core';
import {Video} from '../models/video';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {VideoDeleteComponent} from './video-delete';

@Component({
  selector: 'va-video-card',
  template: `
    <mat-card fxLayout="column" fxLayoutAlign="start stretch" (mouseenter)="mouseOver=true"
              (mouseleave)="mouseOver=false"
              [class.selected]="selected">
      <div style="position: relative">
        <img mat-card-image
             [src]="video.duration ? video.thumbnail : 'https://s3.amazonaws.com/vaetas/images/youtube_under_processing.png'">
        <span *ngIf="video.duration" id="timespan" fxFlexAlign="end">{{video.duration | secondsToTime}}</span>
      </div>
      <span>
        {{video.title | truncate: 40}}
      </span>

      <div class="hover" *ngIf="hoverEnabled && mouseOver">
        <div style="width: 100%;height: 100%" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="30px">
          <button mat-icon-button routerLink="/videos/share/{{video.id}}">
            <mat-icon matTooltip="SHARE" style="background-color: rgba(20,20,20,0)">share</mat-icon>
          </button>
          <button mat-icon-button routerLink="/emails/send" [queryParams]="{video: video.id}">
            <mat-icon matTooltip="EMAIL" style="background-color: rgba(20,20,20,0)">mail</mat-icon>
          </button>
          <button mat-icon-button routerLink="/videos/{{video.id}}">
            <mat-icon matTooltip="PREVIEW" style="background-color: rgba(20,20,20,0)">remove_red_eye</mat-icon>
          </button>
        </div>
      </div>
      <div style="background-color: rgba(81, 155, 217, 0.3);" *ngIf="selected"></div>
      <mat-icon *ngIf="selected">check</mat-icon>
    </mat-card>
  `,
  styles: [`

    :host {
      min-width: 200px;
      min-height: 250px;
    }

    mat-card {
      position: relative;
      height: 100%;
    }

    mat-icon {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 50px;
      height: 50px;
      width: 50px;
      background: #519bd9;
      color: white;
    }

    #timespan {
      position: absolute;
      right: -24px;
      bottom: 24px;
      color: white;
      font-size: 18px;
      padding: 5px 10px;
      background: rgba(0, 0, 0, .6);
    }

    .selected {
      border: 4px solid #519bd9;
    }
  `]
})

export class VideoCardComponent {
  @Input() video: Video;
  @Input() selected = false;
  @Input() hoverEnabled = false; // for use in places where we do not want to use the hover thing.
  mouseOver = false;
}
