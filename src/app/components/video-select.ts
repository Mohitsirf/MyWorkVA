import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Video} from '../models/video';
import {Store} from '@ngrx/store';
import {getVideos, State} from '../reducers/index';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {TimeCompare} from '../utils/time-compare';

@Component({
  selector: 'va-video-select',
  template: `
    <div fxLayoutAlign="start stretch" fxLayout="column" fxLayoutGap="20px">
      <div fxLayout>
        <h2>Select a video to email:</h2>
        <span fxFlex="1 1 auto"></span>
        <va-search-bar (search)="search$.next($event)" fxFlexAlign="end"></va-search-bar>
      </div>
      <div fxLayoutAlign="center center" fxLayoutGap="20px" fxLayoutWrap>
        <va-add-card (click)="addClicked.emit()">Add Video</va-add-card>
        <va-video-card *ngFor="let video of filteredVideos" [video]="video" [selected]="video.id == selectedVideoId"
                       (click)="videoSelected(video)"></va-video-card>
        <span *vaFlexAlignmentHack></span>
      </div>
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

    va-search-bar {
      width: 400px;
      padding-right: 20px;
    }
  `]
})

export class VideoSelectComponent implements OnInit, OnDestroy {
  @Input() selectedVideoId: number;
  @Output() onSelect = new EventEmitter<Video>();
  @Output() addClicked = new EventEmitter();

  private filteredVideos: Video[];
  private search$ = new Subject<string>();
  private alive = true;

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
    const videos$ = this.store.select(getVideos).takeWhile(() => this.alive);
    this.search$.combineLatest(videos$, (search, videos) => {
      return {videos, search};
    }).subscribe((data) => {
      data.videos.sort(TimeCompare.compare);
      console.log(!data.search);
      if (!data.search) {
        this.filteredVideos = data.videos;
      }
      this.filteredVideos = data.videos
        .filter((video) => video.title.toLowerCase().indexOf(data.search.toLowerCase()) !== -1);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  videoSelected(video: Video) {
    this.selectedVideoId = video.id;
    this.onSelect.emit(video);
  }
}
