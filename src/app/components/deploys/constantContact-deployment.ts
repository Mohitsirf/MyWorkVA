/**
 * Created by jatinverma on 8/27/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../../services/vaetas';
import {Email} from '../../models/email';
import {User} from '../../models/user';
import {getLists, getUser, State} from 'app/reducers';
import {Store} from '@ngrx/store';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'va-constant-contact-deploy',
  template: `    
    <form [formGroup]="constantContactDeployForm" (ngSubmit)="constantContactDeployForm.valid && onSubmit()">
      <h2><img src="/assets/images/constantcontact.png"
               style="height: 50px;width: 50px" fxFlexAlign="center center"
               class="primary"/> Constant Contact</h2>
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
          <input formControlName="from_email" matInput placeholder="Email" required> 
          <mat-error>Please provide email</mat-error>
        </mat-form-field>
        <mat-form-field >
          <div fxLayout="row">
          <input formControlName="list_name" matInput placeholder="List Id" required>
            <button mat-icon-button type="button" [matMenuTriggerFor]="listIdMenu">

              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu [overlapTrigger]="false" #listIdMenu="matMenu">
              <mat-list>
                <mat-list-item *ngFor="let listid of this.deployAccountList" (click)="listId(listid)">{{listid.name}}
                </mat-list-item>
              </mat-list>
            </mat-menu>
          </div>
          <mat-error>Please provide list id</mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv">
          <input formControlName="email_id" matInput placeholder="Email Id">
        </mat-form-field>
        <mat-form-field *ngIf="hideDiv">
          <input formControlName="list_id" matInput >
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

export class ConstantContactDeployComponent implements OnInit {
  @Input() selectedAccountId: number;
  @Input() email: Email;
  hideDiv = false;
  constantContactDeployForm: FormGroup;
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

  fetchEmailList(id: number) {
    this.store.select((state) => getLists(state, id)).subscribe((lists) => {
      if (!lists) {
        this.service.fetchDeployAccountList(id).subscribe();
      } else {
        this.deployAccountList = lists['lists'];
      }
    });
  }

  setupUser() {
    this.store.select(getUser).subscribe(
      (response) => {
        this.user = response;
      }
    );
  }

  setup() {
    this.constantContactDeployForm = new FormGroup({
      'subject': new FormControl(null, [Validators.required]),
      'from_name': new FormControl(this.user.first_name + ' ' + this.user.last_name, [Validators.required]),
      'from_email': new FormControl(this.user.email, [Validators.required]),
      'list_id': new FormControl(null, [Validators.required]),
      'list_name': new FormControl(null, [Validators.required]),
      'email_id': new FormControl(this.email.id)
    });
  }

  listId(id: any) {
    this.constantContactDeployForm.patchValue({list_name: id['name']});
    this.constantContactDeployForm.patchValue({list_id: id['id']});
  }

  onSubmit() {
    console.log(this.constantContactDeployForm.value);
    this.loading = true;
    this.service.deployConstantContact(this.selectedAccountId, this.constantContactDeployForm.value).subscribe(() => {
      this.loading = false;
      this.alertService.success('Sent');
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }
}
