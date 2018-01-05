/**
 * Created by jatinverma on 8/27/17.
 */

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../../services/vaetas';
import {Email} from '../../models/email';
import {AlertService} from '../../services/alert';
import {Observable} from 'rxjs/Observable';
import {Contact} from '../../models/contact';
import {EmailsInputComponent} from '../emails-input';
import {getLists, State} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {ObservableInput} from 'observable-input/lib';
import {Router} from '@angular/router';

@Component({
  selector: 'va-google-deploy',
  template: `
    <form [formGroup]="googleDeployForm" (ngSubmit)="googleDeployForm.valid && onSubmit()">
      <h2><img src="/assets/images/google.png" width="100px" fxFlexAlign="center center"
               class="primary"/> Google</h2>
      <mat-form-field style="width: 100%; margin-bottom: 10px">
        <input #subject formControlName="subject" matInput placeholder="Subject" required>
        <mat-error>Please provide subject</mat-error>
      </mat-form-field>
      <va-emails-input #toEmails [contacts]="contacts$ | async" placeholder="To"></va-emails-input>
      <va-emails-input #ccEmails [contacts]="contacts$ | async" placeholder="CC"></va-emails-input>
      <va-emails-input #bccEmails [contacts]="contacts$ | async" placeholder="BCC"></va-emails-input>
      <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" style="margin-top: 20px">
        <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <button mat-raised-button [disabled]="loading" color="accent">
          Send
        </button>
        <button mat-raised-button [disabled]="loading" color="primary" type="button" (click)="saveDraft()"
                matTooltip="Save as draft in your Gmail account">
          Save Draft
        </button>
      </div>
    </form>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    h4 {
      margin-bottom: -15px;
    }
  `]
})

export class GoogleDeployComponent implements OnInit {
  @Input() @ObservableInput()
  selectedAccountId: Observable<number>;
  @Input() email: Email;
  contacts$: Observable<Contact[]>;
  googleDeployForm: FormGroup;
  loading = false;
  alive = true;
  accountId: number;

  @ViewChild('toEmails') toEmailsInput: EmailsInputComponent;
  @ViewChild('ccEmails') ccEmailsInput: EmailsInputComponent;
  @ViewChild('bccEmails') bccEmailsInput: EmailsInputComponent;

  constructor(private service: VaetasService, private alertService: AlertService,
              private store: Store<State>, private router: Router) {
  }

  ngOnInit() {
    this.setup();
    this.fetchContacts();
  }

  fetchContacts() {
    this.contacts$ = this.selectedAccountId
      .switchMap(id => {
        this.accountId = id;
        return this.store.select(state => getLists(state, id));
      })
      .map(lists => {
        if (!lists) {
          this.service.fetchDeployAccountList(this.accountId).subscribe();
        }
        return lists;
      });
  }

  setup() {
    this.googleDeployForm = new FormGroup({
      'subject': new FormControl(null, [Validators.required]),
      'email_id': new FormControl(this.email.id)
    });
  }

  onSubmit() {
    const formValid = this.googleDeployForm.valid;
    const toFieldValid = this.toEmailsInput.valid;
    const ccFieldValid = this.ccEmailsInput.valid;
    const bccFieldValid = this.bccEmailsInput.valid;

    if (!formValid || !toFieldValid || !ccFieldValid || !bccFieldValid) {
      return;
    }

    this.send(false);
  }

  saveDraft() {
    this.send(true);
  }

  send(asDraft: boolean) {
    this.loading = true;
    const data = this.googleDeployForm.value;
    data['to'] = this.toEmailsInput.getEmails();
    data['cc'] = this.ccEmailsInput.getEmails();
    data['bcc'] = this.bccEmailsInput.getEmails();
    data['draft'] = asDraft;
    this.service.deployGoogleAccount(this.accountId, data).subscribe(() => {
      this.loading = false;
      const message = asDraft ? 'Draft created successfully' : 'Email Sent Successfully';
      this.alertService.success(message);
      this.router.navigate(['emails']);
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }
}
