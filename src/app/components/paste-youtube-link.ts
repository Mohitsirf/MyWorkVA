import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert';


@Component({
  selector: 'va-paste-youtube-link',
  template: `
    <h2>Import from Youtube URL</h2>
    <form fxLayout="column" fxLayoutGap="10px" [formGroup]="UrlForm" (ngSubmit)="UrlForm.valid && onSubmit()"
          nonvalidate>
      <mat-form-field style="width: 500px;">
        <input matInput placeholder="Youtube URL" formControlName="url">
        <mat-error>Provide YouTube Video URL</mat-error>
      </mat-form-field>
      <div fxLayout="row" fxLayoutAlign="end center">
        <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
        <button mat-raised-button color="primary" [disabled]="loading"
                color="accent">
          Import
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    mat-spinner {
      margin-right: 20px;
    }

    button {
      margin-bottom: 5px;
    }
  `]
})
export class YoutubeLinkComponent implements OnInit {
  UrlForm: FormGroup;
  loading = false;

  @Input() redirectUrl: string;

  constructor(private service: VaetasService, private alertService: AlertService, private router: Router) {
  }

  ngOnInit() {
    this.UrlForm = new FormGroup({
      'url': new FormControl(null, [Validators.required])
    });

  }

  onSubmit() {
    this.loading = true;
    console.log(this.UrlForm.value);
    this.service.importVideoByUrl(this.UrlForm.value).subscribe((video) => {
      this.loading = false;
      this.alertService.success('Video Imported');
      this.router.navigate([
        this.redirectUrl
      ], {queryParams: {video: video.id}});
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }

}
