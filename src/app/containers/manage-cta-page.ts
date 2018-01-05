/**
 * Created by jatinverma on 8/6/17.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cta} from '../models/cta';
import {Store} from '@ngrx/store';
import {getCtas, State} from '../reducers/index';
import {TimeCompare} from '../utils/time-compare';

@Component({
  selector: 'va-manage-cta-page',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" style="margin-top: 20px; margin-bottom: 400px;">
      <div fxLayoutAlign="center center" fxLayoutWrap fxLayout="row" fxLayoutGap="20px">
        <h1 style="color: #64a9df">My CTAs</h1>
        <button mat-mini-fab color="accent"
                (click)="addCta.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <div *ngIf="ctas.length > 0" fxLayoutAlign="center" fxLayoutWrap fxLayoutGap="20px" style="margin-bottom: 20px">
        <va-cta-card *ngFor="let cta of ctas" [cta]="cta"></va-cta-card>
        <span *vaFlexAlignmentHack></span>
      </div>
      <div *ngIf="ctas.length === 0" fxLayoutAlign="center center">
        <h3>You haven't added any Call To Action (CTA) yet</h3>
      </div>
      <div #addCta fxLayoutAlign="center center" fxLayoutWrap>
        <h1 style="color: #64a9df">Add a New CTA</h1>
      </div>
      <div fxLayoutAlign="center center">
        <va-cta-list></va-cta-list>
      </div>
    </div>
  `,
  styles: [`
    span {
      width: 250px;
    }

    va-cta-card {
      margin-bottom: 20px;
    }
  `]
})
export class ManageCtaPageComponent implements OnInit, OnDestroy {
  private alive = true;
  ctas: Cta[];

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
    this.store.select(getCtas).takeWhile(() => this.alive).subscribe((ctas) => {
      ctas.sort(TimeCompare.compare);
      this.ctas = ctas;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

