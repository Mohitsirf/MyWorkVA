import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Cta} from '../models/cta';
import {Store} from '@ngrx/store';
import {getCtas, State} from '../reducers/index';
import {TimeCompare} from '../utils/time-compare';

@Component({
  selector: 'va-cta-select',
  template: `
    <div *ngIf="ctas.length" fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-none-cta-card (click)="noCtaSelected()" [selected]="selectedCtaId == -1 "></va-none-cta-card>
      <va-email-cta-card *ngFor="let cta of ctas" [cta]="cta" [selected]="cta.id == selectedCtaId"
                         (click)="ctaSelected(cta)"></va-email-cta-card>
      <span *vaFlexAlignmentHack></span>
    </div>
    <div *ngIf="!(this.ctas.length)" fxLayout="column" fxLayoutGap="70px" fxLayoutAlign="center center">
      <h3>You don't have any Call To Action (CTA) configured for your viewers yet.
        <button mat-raised-button color="accent" style="margin-left: 10px; margin-right: 10px" routerLink="/ctas/add">
          Add
        </button>
        a CTA first.
      </h3>
      <h4>Or <a style="color: #64a9df; cursor: pointer" (click)="noCtaSelected()">continue</a> without a CTA</h4>
    </div>
  `,
  styles: [`
    va-email-cta-card {
      margin-bottom: 20px;
    }

    span {
      width: 250px;
    }

    mat-card {
      position: relative;
      height: 200px;
      width: 250px;
    }
  `
  ]
})

export class SendEmailCtaSelectComponent implements OnInit, OnDestroy {
  @Input() selectedCtaId: number;
  @Output() onSelect = new EventEmitter<Cta>();

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

  noCtaSelected() {
    this.selectedCtaId = -1;
    this.onSelect.emit();
  }

  ctaSelected(cta: Cta) {
    this.selectedCtaId = cta.id;
    this.onSelect.emit(cta);
  }
}
