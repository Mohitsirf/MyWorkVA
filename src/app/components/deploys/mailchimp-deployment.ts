/**
 * Created by jatinverma on 8/27/17.
 */

import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../../services/vaetas';
import {Email} from '../../models/email';
import {User} from '../../models/user';
import {Store} from '@ngrx/store';
import {getLists, getUser, State} from 'app/reducers';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'va-mailchimp-deploy',
  template: `
    <h2><img src="/assets/images/mailchimp.png" height="50"/>
      MailChimp</h2>
    <form fxLayout="column" fxLayoutAlign="start stretch" [formGroup]="mailchimpDeployForm"
          (ngSubmit)="mailchimpDeployForm.valid && onSubmit()">
      <mat-form-field>
        <input formControlName="subject" matInput placeholder="Subject"  required>
        <mat-error>Please provide subject</mat-error>
      </mat-form-field>
      <mat-form-field>
        <input formControlName="from_name" type="email" matInput placeholder="Name" required>
        <mat-error>Please provide name</mat-error>
      </mat-form-field>
      <mat-form-field>
        <input formControlName="from_email" matInput placeholder="Email" required>
        <mat-error>Please provide email</mat-error>
      </mat-form-field>
      <mat-form-field>
        <div fxLayout="row">
          <input formControlName="list_name" matInput placeholder="List Id" required>
          <mat-menu [overlapTrigger]="false" #listIdMenu="matMenu">
            <mat-list>
              <mat-list-item *ngFor="let listid of this.deployAccountList" (click)="listId(listid)">{{listid.name}}
              </mat-list-item>
            </mat-list>
          </mat-menu>
          <button mat-icon-button type="button" [matMenuTriggerFor]="listIdMenu">
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
        </div>
        <mat-error>Please select list</mat-error>
      </mat-form-field>
      <mat-form-field *ngIf="hideDiv">
        <input formControlName="list_id" matInput placeholder="Email Id">
      </mat-form-field>
      <mat-form-field *ngIf="hideDiv">
        <input formControlName="email_id" matInput placeholder="Email Id">
      </mat-form-field>
      <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" style="margin-top: 20px;">
        <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <button mat-raised-button type="submit" [disabled]="loading" color="accent">
          Send
        </button>
      </div>
    </form>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    /*TODO: ideally this should not be needed as we have flex stretch. Will investigate later*/
    mat-form-field {
      width: 100%;
    }
  `]
})

export class MailChimpDeployComponent implements OnInit {
  @Input() selectedAccountId: number;
  @Input() email: Email;
  hideDiv = false;
  mailchimpDeployForm: FormGroup;
  loading = false;
  user: User;
  deployAccountList: any[];

  constructor(private service: VaetasService, private store: Store<State>, private alertService: AlertService) {
  }

  ngOnInit() {
    this.fetchEmailList(this.selectedAccountId);
    this.setupUser();
    this.setup();
  }

  setupUser() {
    this.store.select(getUser).subscribe(
      (response) => {
        this.user = response;
      }
    );
  }

  fetchEmailList(id: number) {
    this.store.select((state) => getLists(state, id)).subscribe((lists) => {
      if (!lists) {
        this.service.fetchDeployAccountList(id).subscribe();
      } else {
        this.deployAccountList = lists['lists'];
      }
    });
  }

  setup() {
    this.mailchimpDeployForm = new FormGroup({
      'subject': new FormControl(null, [Validators.required]),
      'from_name': new FormControl(this.user.first_name + ' ' + this.user.last_name, [Validators.required]),
      'from_email': new FormControl(this.user.email, [Validators.required]),
      'list_id': new FormControl(null, [Validators.required]),
      'list_name': new FormControl(null, [Validators.required]),
      'email_id': new FormControl(this.email.id)
    });
  }

  listId(id: any) {
    this.mailchimpDeployForm.patchValue({list_name: id['name']});
    this.mailchimpDeployForm.patchValue({list_id: id['id']});
  }

  onSubmit() {
    this.loading = true;
    console.log(this.mailchimpDeployForm.value);
    this.service.deployMailchimpAccount(this.selectedAccountId, this.mailchimpDeployForm.value).subscribe(() => {
      this.loading = false;
      this.alertService.success('Sent');
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }
}
