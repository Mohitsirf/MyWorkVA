import {Component, OnInit,} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'va-video-tab-layout',
  template: `
    <div fxLayout="column" fxLayoutAlign="start center">
      <mat-tab-group style="width: 100%" [dynamicHeight]="true">
        <mat-tab #recordingTab label="Record from WebCam">
          <va-record-webcam-layout
            [redirectUrl]="redirectTo" [active]="recordingTab.isActive"></va-record-webcam-layout>
        </mat-tab>
        <mat-tab label="Upload Saved Video">
          <va-upload-disk-layout [redirectUrl]="redirectTo"></va-upload-disk-layout>
        </mat-tab>
        <mat-tab label="Paste YouTube Link">
          <va-paste-youtube-link [redirectUrl]="redirectTo"></va-paste-youtube-link>
        </mat-tab>
      </mat-tab-group>
    </div>

  `,
  styles: []
})
export class AddVideoComponent implements OnInit {
  redirectTo: string;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.redirectTo = params['route'] ? params['route'] : 'videos';
    });
  }
}
