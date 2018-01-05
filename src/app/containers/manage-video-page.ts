import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {getUser, getVideos, State} from '../reducers/index';
import {Video} from '../models/video';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {TimeCompare} from '../utils/time-compare';
import {User} from '../models/user';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';

@Component({
  selector: 'va-manage-video-page',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="20px">
      <va-search-bar (search)="search$.next($event)" fxFlexAlign="end"></va-search-bar>
      <div fxLayout="column" fxLayoutAlign="center center">
        <h2 class="intro" *ngIf="!hasVideos">
          Ready to send video email? Let's add your first video. Hit 'Add Video' to get started!
        </h2>
        <va-video-list fxFlex="90%" [videos]="filteredVideos" (addClicked)="addVideo()"></va-video-list>
      </div>
    </div>
  `,
  styles: [`
    va-search-bar {
      width: 400px;
      padding-right: 20px;
    }
  `]
})
export class ManageVideoPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private alive = true;
  private videos$: Observable<Video[]>;
  private hasVideos: boolean;
  private filteredVideos: Video[];
  private search$ = new Subject<string>();
  private showingIntro = false;
  private intro: any;
  private user: User;

  constructor(private store: Store<State>, private router: Router, private service: VaetasService) {
  }

  ngOnInit() {
    this.videos$ = this.store.select(getVideos).takeWhile(() => this.alive);

    this.search$.combineLatest(this.videos$, (search, videos) => {
      return {videos, search};
    }).takeWhile(() => this.alive).filter(() => !this.showingIntro).subscribe((data) => {
      this.hasVideos = data.videos.length > 0;
      console.log('vidoes', this.filteredVideos, data);
      data.videos.sort(TimeCompare.compare);
      if (!data.search) {
        this.filteredVideos = data.videos;
      } else {
        this.filteredVideos = data.videos
          .filter((video) => video.title.toLowerCase().indexOf(data.search.toLowerCase()) !== -1);
      }
    });
  }

  ngAfterViewInit() {
    if (this.filteredVideos.length > 0) {
      const video = this.filteredVideos[0];
      let message = 'Hover over the video to send it as email or share it.';
      if (video.duration === 0) {
        message += ' You don\'t need to wait for YouTube processing to complete to proceed.';
      }
      this.intro = introJs().setOptions({
        steps: [
          {
            element: '#video_1',
            intro: message,
            position: 'right'
          }
        ],
        hidePrev: true,
        hideNext: true,
        exitOnEsc: false,
        exitOnOverlayClick: false,
        disableInteraction: false,
        showStepNumbers: false,
        showBullets: false
      });

      this.store.select(getUser).take(1).subscribe(user => {
        this.user = user;
        if (!user.meta || !user.meta.share_tour) {
          this.intro.start();
          this.showingIntro = true;
          this.intro.oncomplete(() => this.updateMeta());
        }
      });
    }
  }

  ngOnDestroy() {
    this.alive = false;
    if (this.showingIntro) {
      this.intro.exit();
      this.updateMeta();
    }
  }

  updateMeta() {
    let data = {};
    if (this.user.meta) {
      data = {...this.user.meta};
    }
    data['share_tour'] = true;
    console.log('updateMeta called');
    this.service.updateUserDetails({meta: data}).subscribe();
  }

  addVideo() {
    this.router.navigate(['videos', 'add']);
  }
}
