import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'va-search-bar',
  template: `
    <mat-form-field style="width:100%">
      <mat-placeholder fxLayoutAlign="start center">
        <mat-icon>search</mat-icon>
        <span>Search</span>
      </mat-placeholder>
      <input matInput [formControl]="searchField">
    </mat-form-field>
  `,
  styles: []
})

export class SearchBarComponent implements OnInit {

  @Output() search = new EventEmitter<string>();
  searchField: FormControl;

  ngOnInit() {
    this.searchField = new FormControl();

    this.searchField.valueChanges.debounceTime(250).distinctUntilChanged()
      .startWith('').subscribe((value) => {
        console.log('searchField', value);
        this.search.next(value.trim());
      }
    );
  }
}
