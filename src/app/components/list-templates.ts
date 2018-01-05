import {Component, OnDestroy, OnInit} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {getTemplates, getTemplatesLoaded, getTemplatesLoading, State} from '../reducers/index';
import {Store} from '@ngrx/store';
import {Template} from '../models/template';
import {Router} from '@angular/router';
import {TimeCompare} from '../utils/time-compare';

@Component({
  selector: 'va-list-templates',
  template: `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <mat-card (click)="editTemplate(t)" *ngFor="let t of templates" fxLayout="column" fxLayoutAlign="start center">
        <va-template-thumbnail [html]="t.html"></va-template-thumbnail>
        <h4>{{t.name}}</h4>
      </mat-card>
      <span *vaFlexAlignmentHack></span>
    </div>
    <va-center-spinner *ngIf="!isLoaded"></va-center-spinner>
  `,
  styles: [`
    :host {
      padding: 10px;
    }

    mat-card {
      cursor: pointer;
    }

    mat-card, span {
      margin-bottom: 20px;
      width: 250px;
    }
  `],
})

export class ListTemplatesComponent implements OnInit, OnDestroy {
  isLoaded = false;
  private alive = true;
  templates: Template[];

  constructor(private vaetasService: VaetasService, private store: Store<State>, private router: Router) {
  }

  ngOnInit() {
    const templatesloaded$ = this.store.select(getTemplatesLoaded);
    const templatesloading$ = this.store.select(getTemplatesLoading);
    const templates$ = this.store.select(getTemplates);

    templatesloaded$.combineLatest(templatesloading$, templates$, (loaded, loading, templates) => {
      return {loaded, loading, templates};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loaded && !data.loading) {
        this.vaetasService.loadTemplates().subscribe();
      } else if (data.loaded && !data.loading) {
        this.isLoaded = true;
         data.templates.sort(TimeCompare.compare);
       // console.log(data.templates[0].name);
        this.templates = data.templates;
      }
    });
  }

  editTemplate(template: Template) {
    this.router.navigate(['templates', template.id]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
