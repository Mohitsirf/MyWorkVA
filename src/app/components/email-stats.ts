import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {getCta, getEmail, getVideo, State} from '../reducers/index';
import {Video} from '../models/video';
import {Cta} from '../models/cta';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'va-email-stats',
    template: `
      <div fxLayout="column" fxLayoutGap="30px" style="margin-bottom: 50px">
        <h1 fxLayoutAlign="center center" >Email Stats</h1>
        <div fxLayout="column" fxLayoutGap="20px">
          <div fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="20px">
            <h2  >Email Video Play Stats</h2>
            <h3 *ngIf="!this.video">No data available</h3>
          </div>
          <va-video-play-stats *ngIf="video" [email_id]="email_id" [namespace]="video.namespace"></va-video-play-stats>
          <div fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="20px">
            <h2>Email Video Open Stats</h2>
            <h3 *ngIf="!this.video">No data available</h3>
          </div>
          <va-video-open-stats *ngIf="video" [email_id]="email_id" [namespace]="video.namespace"></va-video-open-stats>
          <div fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="20px">
            <h2>Email Cta Stats</h2>
            <h3 *ngIf="!this.cta">No data available</h3>
          </div>
          <va-cta-stats *ngIf="cta" [email_id]="email_id" [namespace]="cta.namespace"></va-cta-stats>
        </div>
      </div>
    `,
    styles: [`
    h2{
      color: #64a9df;
    }
    h3{
        color: red;
      }
    `]
})

export class EmailStatsComponent implements OnInit, OnDestroy {

  video: Video;
  cta: Cta;
  loading = true;
  alive = true;
  email_id: number;

  constructor( private route: ActivatedRoute, private store: Store<State>) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.email_id = params['id'];
      this.store.select((state) => getEmail(state, this.email_id)).takeWhile(() => this.alive).subscribe((email) => {
        this.store.select((state) => getVideo(state, email.video_id)).subscribe((video) => {
          this.video = video;
        });
        this.store.select((state) => getCta(state, email.cta_id)).subscribe((cta) => {
          this.cta = cta;
        });
      });
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
