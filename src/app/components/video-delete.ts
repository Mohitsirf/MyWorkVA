import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {VaetasService} from '../services/vaetas';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-delete-video',
  template: `
    <mat-dialog-content>
      <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">

        <h2>Are you sure you want to delete this video?</h2>
        <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px">
          <mat-spinner color="accent" *ngIf="loading" style="max-height: 40px"></mat-spinner>
          <button mat-raised-button style="background-color: red" [disabled]="loading"
                  (click)="onDelete()" color="accent">
            DELETE
          </button>
          <button mat-raised-button (click)="cancelButtonPressed()" color="white" [disabled]="loading">
            CANCEL
          </button>
        </div>
      </div>
    </mat-dialog-content>
  `,
  styles: [``]
})

export class VideoDeleteComponent {
  loading = false;
  id: number;

  constructor(private dialog: MatDialogRef<VideoDeleteComponent>, private route: ActivatedRoute, private service: VaetasService,
              private alertService: AlertService) {
  }

  onDelete() {
    this.loading = true;
    console.log(this.route);

    this.service.deleteVideo(this.id).subscribe(() => {
      this.dialog.close();
      this.alertService.success('Video Deleted');
    }, (error) => {
      this.alertService.error(error.message);
    });

  }

  cancelButtonPressed() {
    this.dialog.close();
  }
}
