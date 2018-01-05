/**
 * Created by ishan on 11.9.17
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, getEmails, getEmailLoading} from '../reducers/index';
import {Email} from '../models/email';
import {TimeCompare} from '../utils/time-compare';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'va-manage-emails-page',
  template: `
    <div style="padding: 10px" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="20px">

      <div fxLayout="row" fxLayoutGap="50px" fxLayoutAlign="end center">
        <va-search-bar (search)="searchChanged($event)" fxFlex="0 1 300px"></va-search-bar>
        <div fxLayout="row" fxLayoutAlign="stretch center" fxLayoutGap="15px">
          <h3>Filter: </h3>
          <mat-radio-group (change)="categoryChanged($event.value)">
            <div fxLayout="row" fxLayoutGap="15px">
              <mat-radio-button value="all" checked="true">
                All
              </mat-radio-button>
              <mat-radio-button value="sent">
                Sent
              </mat-radio-button>
              <mat-radio-button value="draft">
                Draft
              </mat-radio-button>
            </div>
          </mat-radio-group>
        </div>

      </div>

      <div fxLayout="column" fxLayoutAlign="start center">
        <h2 class="intro" *ngIf="emails.length === 0">
          This is where you will compose new video email and find old ones. Hit compose to get started!
        </h2>
        <va-email-list [emails]="filteredEmails"></va-email-list>
      </div>
    </div>

    <va-center-spinner *ngIf="loading$ | async"></va-center-spinner>
  `,
  styles: []
})
export class ManageEmailPageComponent implements OnInit, OnDestroy {
  emails: Email[];
  filteredEmails: Email[];
  keyword = '';
  selectedCategory = 'all';
  private alive = true;
  loading$: Observable<boolean>;

  constructor(private store: Store<State>, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.select(getEmails).takeWhile(() => this.alive).subscribe(emails => {
      emails.sort(TimeCompare.compare);
      this.emails = emails;
      this.updateFilteredEmails();
    });

    this.loading$ = this.store.select(getEmailLoading);
  }

  updateFilteredEmails() {
    this.filteredEmails = this.emails.filter((email) => {
      const hasKeyword = !this.keyword || email.title.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1;
      const isOfSelectedCategory = this.selectedCategory === 'all'
        || (this.selectedCategory === 'draft' && !email.sent)
        || (this.selectedCategory === 'sent' && email.sent);

      return hasKeyword && isOfSelectedCategory;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  searchChanged(value) {
    this.keyword = value;
    this.updateFilteredEmails();
  }

  categoryChanged(value?: string) {
    this.selectedCategory = value;
    this.updateFilteredEmails();
  }
}
