import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getTemplate, getTemplatesLoaded, getTemplatesLoading, State} from 'app/reducers';
import {VaetasService} from '../services/vaetas';
import {Observable} from 'rxjs/Observable';
import {Template} from '../models/template';
import {TemplateEditorComponent} from '../components/template-editor';
import {FormControl, Validators} from '@angular/forms';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-edit-template',
  template: `
    <div *ngIf="template">
      <div class="bgPrimary100 controls" fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="15px">
        <h3 fxFlex="1 1 auto">{{template.name}}</h3>
        <button *ngIf="!isSaveAsNewClicked" mat-raised-button (click)="updateTemplate()"
                color="accent" [disabled]="template.public">Save
        </button>
        <button *ngIf="!isSaveAsNewClicked" mat-raised-button (click)="isSaveAsNewClicked = true"
                color="accent">Save as New
        </button>
        <button *ngIf="!isSaveAsNewClicked" mat-raised-button (click)="deleteTemplate(template.id)"
                color="primary" [disabled]="template.public">Delete
        </button>
        <mat-form-field fxFlex="500px" *ngIf="isSaveAsNewClicked">
          <input [formControl]="control" matInput placeholder="Name of new template" required>
          <mat-error>This is a mandatory feild</mat-error>
        </mat-form-field>
        <button mat-mini-fab *ngIf="isSaveAsNewClicked" (click)="saveNewTemplate()"
                [disabled]="control.invalid">
          <mat-icon>done</mat-icon>
        </button>
        <button mat-mini-fab *ngIf="isSaveAsNewClicked"
                (click)="isSaveAsNewClicked=false && control.reset()">
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      <va-template-editor #editor [html]="template.html"></va-template-editor>
    </div>
    <va-center-spinner *ngIf="!(templatesloaded$ | async) || saving"></va-center-spinner>
  `,
  styles: [`
    .controls {
      height: 80px;
      padding-right: 15px;
      padding-left: 15px;
    }
  `]
})

export class EditTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor: TemplateEditorComponent;
  isSaveAsNewClicked = false;
  control: FormControl;
  saving = false;
  private alive = true;
  templatesloaded$: Observable<boolean>;
  template: Template;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<State>,
              private vaetasService: VaetasService, private alert: AlertService) {
  }

  ngOnInit() {
    this.templatesloaded$ = this.store.select(getTemplatesLoaded);
    const templatesloading$ = this.store.select(getTemplatesLoading);

    this.templatesloaded$.combineLatest(templatesloading$, (loaded, loading) => {
      return {loaded, loading};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loaded && !data.loading) {
        this.vaetasService.loadTemplates().subscribe();
      }
    });

    this.templatesloaded$.filter(loaded => loaded).take(1).subscribe(() => {
      console.log('temlates loaded');
      this.route.params.map(params => params['id'])
        .switchMap((id) => this.store.select((state) => getTemplate(state, id)))
        .subscribe((template) => {
          this.template = template;
        });
    });

    this.control = new FormControl('', [Validators.required]);
  }

  updateTemplate() {
    this.saving = true;
    this.vaetasService.updateTemplate(this.template.id, {html: this.editor.getHtml()})
      .subscribe(() => {
          this.alert.success('Template updated Succesfuly');
          this.saving = false;
        },
        (error) => {
          this.alert.error(error.message);
          this.saving = false;
        });
  }

  saveNewTemplate() {
    console.log('POST is called here');
    this.saving = true;
    this.vaetasService.storeTemplate({
      name: this.control.value,
      html: this.editor.getHtml()
    }).subscribe(
      (response) => {
        this.alert.success('Template saved Succesfuly')
        this.template = response;
        this.isSaveAsNewClicked = false;
        this.saving = false;
        this.control.reset();
        this.router.navigate(['templates', this.template.id]);
      },
      (error) => {
        this.alert.error(error.message);
        this.saving = false;
      }
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }

  deleteTemplate(id: number) {
    this.vaetasService.deleteTemplate(id).subscribe(() => {
      this.router.navigate(['/templates']);
      this.alert.success('Template Deleted');
    }, (error) => {
      this.alert.error(error.message);
    });
  }


}
