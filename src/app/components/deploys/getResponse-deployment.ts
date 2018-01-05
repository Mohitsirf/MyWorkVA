/**
 * Created by jatinverma on 8/27/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../../services/vaetas';
import {Email} from '../../models/email';
import {User} from '../../models/user';
import {Store} from '@ngrx/store';
import {getLists, getUser, State} from '../../reducers/index';
import {AlertService} from '../../services/alert';
@Component({
  selector: 'va-get-response-deploy',
  template: `    
    <form [formGroup]="getResponseDeployForm" (ngSubmit)="getResponseDeployForm.valid && onSubmit()">

      <h2><img src="/assets/images/getresponse.png"
               style="height: 50px;width: 50px" fxFlexAlign="center center"
               class="primary"/> Get Response</h2>
      <div style="margin-top: 25px; width: 100%;" fxLayout="column">
        <mat-form-field >
          <input formControlName="subject" matInput placeholder="Subject" required>
          <mat-error>Please provide subject</mat-error>
        </mat-form-field>
        <mat-form-field >
          <input formControlName="from_name" type="email" matInput placeholder="Name" required>
          <mat-error>Please provide name</mat-error>
        </mat-form-field>
        <mat-form-field >
          <div fxLayout="row">
          <input formControlName="from_field_name" matInput placeholder="From Field Id" required>
          <button mat-icon-button type="button" [matMenuTriggerFor]="fromFieldIdMenu">
            <mat-icon>arrow_drop_down</mat-icon></button>
            <mat-menu [overlapTrigger]="false" #fromFieldIdMenu="matMenu">
              <mat-list>
                <mat-list-item *ngFor="let listid of this.deployFromFieldList"
                              (click)="fromFieldId(listid)">{{listid.name}}</mat-list-item>
              </mat-list>
            </mat-menu></div>
          <mat-error>Please provide from field id</mat-error>

        </mat-form-field>
        <mat-form-field >
          <div fxLayout="row">
          <input formControlName="campaign_name" matInput placeholder="Campaign Id" required>
          <button mat-icon-button type="button" [matMenuTriggerFor]="campaignIdMenu">
            <mat-icon>arrow_drop_down</mat-icon></button>
            <mat-menu [overlapTrigger]="false" #campaignIdMenu="matMenu">
              <mat-list>
                <mat-list-item *ngFor="let listid of this.deployCampaignList"
                              (click)="campaignListId(listid)">{{listid.name}}</mat-list-item>
              </mat-list>
            </mat-menu></div>
          <mat-error>Please provide Campaign id</mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv" >
        <input formControlName="email_id" matInput >
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv" >
          <input formControlName="from_field_id" matInput >
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv" >
          <input formControlName="campaign_id" matInput >
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" style="margin-top: 20px">
          <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button [disabled]="loading" type="submit" color="accent">
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
    mat-form-field {
      width: 100%;
    }
  `]
})

export class GetResponseDeployComponent implements OnInit {
  @Input() selectedAccountId: number;
  @Input() email: Email;
  hideDiv = false;
  getResponseDeployForm: FormGroup;
  deployFromFieldList: any[];
  deployCampaignList: any[];
  loading = false;
  user: User;
  constructor(private service: VaetasService, private store: Store<State>,
              private alertService: AlertService) {
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
        this.deployFromFieldList = lists['from_fields'];
        this.deployCampaignList = lists['campains'];
      }
    });
  }

  fromFieldId(id: any) {
    this.getResponseDeployForm.patchValue({from_field_name: id['name']});
    this.getResponseDeployForm.patchValue({from_field_id: id['id']});
  }

  campaignListId(id: any) {
    this.getResponseDeployForm.patchValue({campaign_name: id['name']});
    this.getResponseDeployForm.patchValue({campaign_id: id['id']});
  }

  setup() {
    this.getResponseDeployForm = new FormGroup({
      'subject': new FormControl(null, [Validators.required]),
      'from_name': new FormControl(this.user.first_name + ' ' + this.user.last_name, [Validators.required]),
      'from_field_id': new FormControl(null, [Validators.required]),
      'from_field_name': new FormControl(null, [Validators.required]),
      'campaign_id': new FormControl(null, [Validators.required]),
      'campaign_name': new FormControl(null, [Validators.required]),
      'email_id' : new FormControl(this.email.id)
    });
  }

  onSubmit() {
    this.loading = true;
      this.service.deployGetResponse(this.selectedAccountId, this.getResponseDeployForm.value).subscribe(() => {
      this.loading = false;
      this.alertService.success('Sent');
    }, (error) => {
        this.alertService.error(error.message);
        this.loading = false;
      });
  }
}
