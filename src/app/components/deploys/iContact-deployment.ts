/**
 * Created by jatinverma on 8/27/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../../services/vaetas';
import {Email} from '../../models/email';
import {Store} from '@ngrx/store';
import {getLists, getUser, State} from '../../reducers/index';
import {User} from '../../models/user';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'va-icontact-deploy',
  template: `
    <form [formGroup]="iContactForm" (ngSubmit)="iContactForm.valid && onSubmit()">
      <h2><img src="/assets/images/icontact.png"
               style="height: 50px;width: 50px" fxFlexAlign="center center"
               class="primary"/> IContact</h2>
      <div style="margin-top: 25px; width: 100%;" fxLayout="column">
        <mat-form-field >
          <input formControlName="subject" matInput placeholder="Subject" required>
          <mat-error>Please provide subject</mat-error>
        </mat-form-field>
        <mat-form-field >
          <div fxLayout="row">
          <input formControlName="list_name" matInput placeholder="List Id"  required>
            <button mat-icon-button type="button" [matMenuTriggerFor]="listIdMenu">
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu [overlapTrigger]="false" #listIdMenu="matMenu">
              <mat-list>
                <mat-list-item *ngFor="let listid of this.deployAccountList"
                              (click)="listId(listid)">{{listid.name}}
                </mat-list-item>
              </mat-list>
            </mat-menu>
          </div>
          <mat-error>Please provide list id</mat-error>
        </mat-form-field>
        <mat-form-field >
          <div fxLayout="row">
          <input formControlName="campaign_name" matInput placeholder="Campaign Id" required>
            <button mat-icon-button type="button" [matMenuTriggerFor]="campaignIdMenu">
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu [overlapTrigger]="false" #campaignIdMenu="matMenu">
              <mat-list>
                <mat-list-item *ngFor="let listid of this.deployCampaignList"
                              (click)="campaignListId(listid)">{{listid.name}}
                </mat-list-item>
              </mat-list>
            </mat-menu>
          </div>
          <mat-error>Please provide Campaign id</mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv">
          <input formControlName="list_id" matInput >
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv">
          <input formControlName="campaign_id" matInput >
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv">
          <input formControlName="email_id" matInput>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" style="margin-top: 20px">
          <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button type="submit" [disabled]="loading" color="accent">
            Send
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }
    mat-form-field{
      width: 100%;
    }
  `]
})

export class IContactDeployComponent implements OnInit {
  @Input() selectedAccountId: number;
  @Input() email: Email;
  hideDiv = false;
  iContactForm: FormGroup;
  loading = false;
  user: User;
  deployAccountList: any[];
  deployCampaignList: any[];

  constructor(private service: VaetasService, private store: Store<State>,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.fetchEmailList(this.selectedAccountId);
    this.setupUser();
    this.setup();
  }

  fetchEmailList(id: number) {

    this.store.select((state) => getLists(state, id)).subscribe((lists) => {
      if (!lists) {
        this.service.fetchDeployAccountList(id).subscribe();
      } else {
        this.deployAccountList = lists['lists'];
        this.deployCampaignList = lists['campaigns'];
      }
    });
  }

  setup() {
    this.iContactForm = new FormGroup({
      'subject': new FormControl(null, [Validators.required]),
      'list_id': new FormControl(null, [Validators.required]),
      'list_name': new FormControl(null, [Validators.required]),
      'campaign_id': new FormControl(null, [Validators.required]),
      'campaign_name': new FormControl(null, [Validators.required]),
      'email_id': new FormControl(this.email.id)
    });
  }

  setupUser() {
    this.store.select(getUser).subscribe(
      (response) => {
        this.user = response;
      }
    );
  }

  listId(id: any) {
    this.iContactForm.patchValue({list_name: id['name']});
    this.iContactForm.patchValue({list_id: id['id']});
  }

  campaignListId(id: any) {
    this.iContactForm.patchValue({campaign_name: id['name']});
    this.iContactForm.patchValue({campaign_id: id['id']});
  }

  onSubmit() {
    console.log(this.iContactForm.value);
    this.loading = true;
    this.service.deployIContact(this.selectedAccountId, this.iContactForm.value).subscribe(() => {
      this.loading = false;
      this.alertService.success('Sent');
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }
}
