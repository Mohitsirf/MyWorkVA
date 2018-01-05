import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatChipInputEvent, MatAutocompleteSelectedEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
import {FormControl, Validators} from '@angular/forms';
import {Contact} from '../models/contact';

const COMMA = 188;

@Component({
  selector: 'va-emails-input',
  template: `
    <h4>{{placeholder}}</h4>
    <mat-form-field style="width: 100%">
      <mat-chip-list #chipList [formControl]="chipControl" aria-orientation="vertical">
        <mat-chip *ngFor="let email of emails" [selectable]="true" [removable]="true"
                  (remove)="remove(email)">
          {{email}}
          <mat-icon matChipRemove>cancel</mat-icon>
        </mat-chip>
      </mat-chip-list>
      <input #emailInput matInput
             [matChipInputFor]="chipList"
             [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
             (matChipInputTokenEnd)="add($event)"
             [matAutocomplete]="auto"
             [matChipInputAddOnBlur]="true"
             [formControl]="control"
             style="width: 100%"
             required
      />
      <mat-error>Enter a valid email address</mat-error>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="autocomplete($event)">
        <mat-option *ngFor="let contact of filteredEmails" [value]="contact">
          {{ contact }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [`
    h4 {
      margin-bottom: 0;
    }

    mat-chip-list {
      margin-bottom: 10px;
    }
  `]
})


export class EmailsInputComponent implements OnInit {
  @Input() contacts: Contact[];
  @Input() required = false;
  @Input() placeholder = 'email';
  private emails: string[] = [];
  separatorKeysCodes = [ENTER, COMMA];
  filteredEmails: string[];

  get valid(): boolean {
    this.chipControl.updateValueAndValidity();
    return this.chipControl.valid;
  }

  // need this because due to some reason this.control.setValue() is not working.
  @ViewChild('emailInput') emailInput: ElementRef;

  control: FormControl = new FormControl();
  chipControl: FormControl;

  ngOnInit() {
    this.chipControl = new FormControl(null, this.emailRequiredValidation.bind(this));

    this.control.valueChanges
      .startWith(null)
      .map(val => {
        if (!val) {
          this.chipControl.updateValueAndValidity();
        }
        return this.filter(val);
      }).subscribe((emails) => this.filteredEmails = emails);
  }

  add(event: MatChipInputEvent) {
    if (this.control.value && Validators.email(this.control) != null) {
      this.chipControl.updateValueAndValidity();
      return;
    }
    const input = event.input;
    this.addEmail(event.value);

    if (input) {
      input.value = '';
    }
  }

  autocomplete(event: MatAutocompleteSelectedEvent) {
    this.addEmail(event.option.value);
    this.emailInput.nativeElement.value = '';
  }

  addEmail(email: string) {
    const value = (email || '').trim();

    if (value && this.emails.indexOf(value) === -1) {
      this.emails.push(value);
      this.chipControl.updateValueAndValidity();
    }

    this.filteredEmails = [];
  }


  remove(email: string) {
    const index = this.emails.indexOf(email);
    if (index !== -1) {
      this.emails.splice(index, 1);
      this.chipControl.updateValueAndValidity();
    }
  }

  getEmails() {
    return this.emails;
  }

  removeEmails() {
    this.emails = [];
  }

  filter(val: string): string[] {
    if (!this.contacts) {
      return [];
    }
    return this.contacts.reduce((filtered, contact) => {
      if (!val || !val.trim() || contact.name.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
        return filtered.concat(contact.emails);
      } else {
        return filtered.concat(contact.emails.filter((email) => email.toLowerCase().indexOf(val.toLowerCase()) !== -1));
      }
    }, []);
  }

  emailRequiredValidation(control: FormControl) {
    if ((!this.required || this.emails.length > 0)
      && (!this.control.value || Validators.email(this.control) == null)) {
      return null;
    }
    return {
      emailRequired: {
        valid: false
      }
    };
  }
}
