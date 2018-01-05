/**
 * Created by jatinverma on 8/31/17.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Email} from '../models/email';
import {Router} from '@angular/router';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';
import {EmailDeleteComponent} from './email-delete-confirmation';
import {MatDialog} from '@angular/material';
import {EmailCloneTitleComponent} from './email-clone-title';

@Component({
  selector: 'va-email-card',
  template: `
    <mat-card fxLayout="column">
      <h3>{{email.title | truncate: 35}}</h3>
      <va-template-thumbnail [html]="email.html" [showDefaultLogo]="false"></va-template-thumbnail>
      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
        <button mat-raised-button matTooltip="copy"
                color="accent" (click)="replicateButtonTapped()">
          <mat-icon>content_copy</mat-icon>
        </button>
        <button *ngIf="!email.sent" mat-raised-button matTooltip="send"
                color="accent" (click)="sendButtonTapped()">
          <mat-icon>send</mat-icon>
        </button>
        <button *ngIf="email.sent" mat-raised-button matTooltip="View Stats"
                color="accent" (click)="viewReportButtonTapped()">
          <mat-icon>trending_up</mat-icon>
        </button>
      </div>
    </mat-card>
    <button class="delete" mat-icon-button color="primary">
      <mat-icon matTooltip="DELETE" (click)="deleteVideo(email.id)">delete</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      position: relative;
    }

    va-template-thumbnail {
      margin-bottom: 15px;
    }

    button.delete {
      position: absolute;
      top: 0px;
      right: 0px;
    }

    h3 {
      font-size: 0.8em;
    }
  `]
})

export class EmailCardComponent {

  @Input() email: Email;
  @Output() isReplicating = new EventEmitter<boolean>();

  constructor(private router: Router, private service: VaetasService,
              public alertService: AlertService, private dialog: MatDialog) {
  }

  sendButtonTapped() {
    this.router.navigate(['emails', 'send', this.email.id]);
  }

  viewReportButtonTapped() {
    this.router.navigate(['emails', 'stats', this.email.id]);
  }

  replicateButtonTapped() {
    this.isReplicating.emit(true);

    const dialogRef = this.dialog.open(EmailCloneTitleComponent, ({disableClose: true}));
    dialogRef.componentInstance.id = this.email.id;
    dialogRef.updateSize('80%');
    dialogRef.afterClosed().subscribe(() => {
      this.isReplicating.emit(false);
    });

  }

  deleteVideo(id) {
    const dialogRef = this.dialog.open(EmailDeleteComponent, ({disableClose: true}));
    dialogRef.componentInstance.id = id;
    dialogRef.updateSize('80%');
    dialogRef.afterClosed().subscribe(() => console.log('popup closed'));
  }
}
