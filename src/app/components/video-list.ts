import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Video} from '../models/video';
import {Router} from '@angular/router';

@Component({
  selector: 'va-video-list',
  template: `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-add-card (click)="addClicked.emit()" [icon]="'add'">Add Video</va-add-card>
      <va-video-card style="cursor: pointer" [hoverEnabled]="true" *ngFor="let video of videos; let idx = index" 
                     id="video_{{idx + 1}}" [video]="video"></va-video-card>

      <span *vaFlexAlignmentHack></span>
    </div>
  `,
  styles: [`

    va-add-card, va-video-card {
      width: 250px;
      height: 250px;
      margin-bottom: 20px;
    }

    span {
      width: 250px;
    }
  `
  ]
})

export class VideoListComponent {
  @Input() videos: Array<Video>;
  @Output() addClicked = new EventEmitter();

  editVideo(id) {
    this.router.navigate(['videos', id]);
  }

  constructor(private router: Router) {
  }
}
