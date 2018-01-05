import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {AlertService} from '../services/alert';


@Component({
  selector: 'va-settings',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="30px" style="margin: 20px">
      <h2>Profile settings</h2>
      <va-profile-settings></va-profile-settings>
      <hr/>
      <h2>Plan Settings</h2>
      <va-billing ></va-billing>
    </div>
  `,
  styles: [`
    mat-tab-group {
      padding: 20px;
    }
  `
  ]
})

export class SettingsComponent {
  constructor(private location: Location, private alert: AlertService) {

  }

  onAbandon() {
    this.alert.success('ABANDON Button Clicked');
    this.location.back();
  }

  onSave() {
    this.alert.success('Save Button Clicked');
  }
}
