import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cta} from '../models/cta';
import {Store} from '@ngrx/store';
import {State, getCtas, getVideo} from '../reducers/index';
import {ActivatedRoute} from '@angular/router';
import {Video} from '../models/video';
import {environment} from '../../environments/environment';
import {AlertService} from '../services/alert';
import {EMBED_CODE_PREFIX, EMBED_CODE_SUFFIX} from '../utils/constants';

@Component({
  selector: 'va-share-video',
  template: `
    <mat-tab-group [(selectedIndex)]="selectedIndex" style="margin: 20px">
      <mat-tab label="1. Select CTA">
        <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
          <va-cta-select [selectedCtaId]="selectedCtaId" (onSelect)="ctaSelected($event)"></va-cta-select>
        </div>
      </mat-tab>
      <mat-tab [disabled]="!shareEnabled" label="2. Choose Share Option">
        <div>
          <h2>SOCIAL SHARE</h2>
          <share-buttons [url]="getVideoUrl(true)" [title]="selectedVideo.title"
                         [description]="selectedVideo.description"
                         [image]="selectedVideo.poster"></share-buttons>
        </div>
        <hr>
        <div fxLayout="column">
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
            <h3>Public URL:</h3>
            <mat-slide-toggle [(ngModel)]="autoplay">
              Autoplay video
            </mat-slide-toggle>
          </div>
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
            <p class="embed-code">{{videoUrl}}</p>
            <button mat-raised-button color="accent" ngxClipboard [cbContent]="videoUrl"
                    (click)="copy('Video URL')">COPY
            </button>
          </div>
        </div>
        <hr>
        <div fxLayout="column">
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
            <h3>Embed Code for Websites:</h3>
            <mat-slide-toggle [(ngModel)]="autoplay">
              Autoplay Video
            </mat-slide-toggle>
          </div>
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
            <p class="embed-code">{{embedCode}}</p>
            <button mat-raised-button ngxClipboard [cbContent]="embedCode" [color]="'accent'"
                    (click)="copy('Embed Code for Website')">
              COPY
            </button>
          </div>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`    
    .embed-code {
      border: 1px solid black;
      border-radius: 8px;
      padding: 15px;
      max-width: 70em;
      font-family: monospace, monospace;
    }
  `]
})

export class ShareVideoComponent implements OnInit, OnDestroy {
  cta: Cta;
  selectedVideo: Video;
  selectedCtaId: number;
  shareEnabled = false;
  selectedIndex = 0;
  private alive = true;
  autoplay = true;
  ctas: Cta[];

  get videoUrl(): string {
    return this.getVideoUrl(this.autoplay);
  }

  get embedCode(): string {
    return EMBED_CODE_PREFIX + this.getVideoUrl(this.autoplay) + EMBED_CODE_SUFFIX;
  }


  constructor(private alertService: AlertService, private route: ActivatedRoute, public store: Store<State>) {
  }

  ngOnInit() {
    this.store.select(getCtas).takeWhile(() => this.alive).subscribe((ctas) => {
      this.ctas = ctas;
    });

    this.route.params.map(params => params['id'])
      .switchMap((id) => this.store.select((state) => getVideo(state, id))).takeWhile(() => this.alive)
      .subscribe((video) => {
        this.selectedVideo = video;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ctaSelected(cta: Cta) {
    this.cta = cta;
    this.selectedCtaId = cta ? cta.id : -1;
    this.shareEnabled = true;
    this.selectedIndex = 1;
  }

  copy(type: string) {
    this.alertService.success(type + ' copied to clipboard');
  }

  getVideoUrl(autoplay: boolean): string {
    let url: string;
    url = environment.videoBaseUrl + this.selectedVideo.namespace;
    if (this.cta) {
      url += '?cta=' + this.cta.namespace;
    }
    if (autoplay) {
      url += this.cta ? '&' : '?';
      url += 'play=true';
    }
    return url;
  }
}
