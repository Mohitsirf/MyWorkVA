import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Store} from '@ngrx/store';
import {getTemplates, getTemplatesLoaded, getTemplatesLoading, State} from '../reducers/index';
import {VaetasService} from '../services/vaetas';
import {Template} from '../models/template';
import {TimeCompare} from '../utils/time-compare';

@Component({
  selector: 'va-template-select',
  template: `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-template-card *ngFor="let template of templates" [template]="template" 
                        [selected]="template.id == selectedTemplateId"  (click)="templateSelected(template)" >
      </va-template-card>
      <span *vaFlexAlignmentHack></span>
    </div>`,
  styles: [`
    va-template-card{  
      width: 250px;
      min-height: 300px;
    }
    span {
      min-width: 250px;
    }

  `]
})

export class TemplateSelectComponent implements OnInit, OnDestroy {

  @Input() selectedTemplateId: number;
  @Output() onSelect = new EventEmitter<Template>();

  private alive = true;
  templates: Template[];
  constructor(public store: Store<State>, public service: VaetasService) {
  }
  ngOnInit() {
    const templatesloading = this.store.select(getTemplatesLoading);
    const templatesloaded = this.store.select(getTemplatesLoaded);

    templatesloading.combineLatest(templatesloaded, (loading, loaded) => {
      return {loading, loaded};
    }).takeWhile( () => this.alive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.loadTemplates().subscribe();
      } else if (data.loaded && !data.loading) {
        this.store.select(getTemplates).subscribe((templates) => {
          templates.sort(TimeCompare.compare);
          this.templates = templates;
        });
      }
    });
  }
  ngOnDestroy() {
    this.alive = false;
  }
  templateSelected(template: Template) {
    this.selectedTemplateId = template.id;
    this.onSelect.emit(template);
  }
}
