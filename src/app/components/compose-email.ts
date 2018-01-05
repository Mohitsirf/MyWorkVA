import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Video} from '../models/video';
import {getEmail, State, getVideo, getCta} from '../reducers/index';
import {Store} from '@ngrx/store';
import {VaetasService} from '../services/vaetas';
import {Cta} from '../models/cta';
import {Template} from '../models/template';
import {Account} from '../models/accounts/account';
import {Email} from '../models/email';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../services/alert';
import {environment} from '../../environments/environment';
import {EmailTemplateEditComponent} from 'app/components/email-template-edit';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'va-compose-email',
  template: `
    <mat-tab-group [(selectedIndex)]="selectedIndex">
      <mat-tab label="1. Pick a Video">
        <va-video-select [selectedVideoId]="selectedVideo && selectedVideo.id" (addClicked)="addVideo()"
                         (onSelect)="videoSelected($event)"></va-video-select>
      </mat-tab>
      <mat-tab [disabled]="stepsEnabled < 1" label="2. Pick a CTA">
        <va-cta-select [selectedCtaId]="(selectedCta && selectedCta.id) || (nullCtaSelected && -1)"
                       (onSelect)="ctaSelected($event)"></va-cta-select>
      </mat-tab>
      <mat-tab [disabled]="stepsEnabled < 2" label="3. Pick a Template">
        <va-template-select [selectedTemplateId]="selectedTemplate && selectedTemplate.id"
                            (onSelect)="templateSelected($event)"></va-template-select>
      </mat-tab>
      <mat-tab [disabled]="stepsEnabled < 3" label="4. Edit Template">
        <va-edit-email-template #editor [title]="emailTitle" [html]="html" [includeGif]="includeGif"
                                [gifAvailable]="!!selectedVideo && !!selectedVideo.gif"
                                (gifToggle)="gifToggle($event)" (save)="save($event)"></va-edit-email-template>
      </mat-tab>
      <mat-tab [disabled]="stepsEnabled < 4" label="5. Pick an Email Account">
        <va-account-select [selectedAccountId]="selectedAccount && selectedAccount.id"
                           (onSelect)="accountSelected($event)"></va-account-select>
      </mat-tab>
      <mat-tab [disabled]="stepsEnabled < 5" label="6. Send Video Email">
        <va-send-email *ngIf="selectedAccount" [account]="selectedAccount" [email]="email"></va-send-email>
      </mat-tab>
    </mat-tab-group>
    <va-center-spinner *ngIf="saving"></va-center-spinner>
  `,
  styles: [`
    mat-tab-group {
      padding: 20px;
      height: 100%;
    }
  `
  ]
})

export class ComposeEmailComponent implements OnInit, OnDestroy {
  nullCtaSelected = false;
  saving = false;
  private _selectedIndex = 0;
  stepsEnabled = 0;
  isAlive = true;
  videoSubscription: Subscription;

  set selectedVideo(video: Video) {
    this._selectedVideo = video;

    if (this.videoSubscription) {
      this.videoSubscription.unsubscribe();
    }

    if (video.duration === 0 || !video.gif) {
      this.videoSubscription = this.store.select((state) => getVideo(state, video.id))
        .takeWhile(() => this.isAlive).subscribe(vid => {
          if (vid.duration !== 0 && vid.gif) {
            this.selectedVideo = vid;
          }
        });
    }
  }

  get selectedVideo(): Video {
    return this._selectedVideo;
  }

  _selectedVideo: Video;
  selectedCta: Cta;
  selectedTemplate: Template;
  selectedAccount: Account;
  includeGif: boolean;
  emailTitle: string;
  html: string;
  htmlChanged = false;
  email: Email;
  id: number;
  @ViewChild('editor') templateEditor: EmailTemplateEditComponent;

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  @Input()
  set selectedIndex(newIndex: number) {

    // if user is coming back from editor step, html may have changed.
    if (this._selectedIndex === 3 && newIndex < 3) {
      this.html = this.templateEditor.getHtml();
    }

    this._selectedIndex = newIndex;

    if (newIndex > this.stepsEnabled) {
      this.stepsEnabled = newIndex;
    }

    if (newIndex > 3 && this.htmlChanged) {
      this.htmlChanged = false;
      const data = {
        title: this.emailTitle,
        html: this.html,
        video_id: this.selectedVideo.id,
        cta_id: null
      };
      if (!this.nullCtaSelected && this.selectedCta) {
        data.cta_id = this.selectedCta.id;
      }
      this.saving = true;
      if (this.email) {
        this.updateEmail(data);
      } else {
        this.storeEmail(data);
      }

    }
  }


  constructor(public store: Store<State>, public service: VaetasService, private router: Router,
              private route: ActivatedRoute, private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.params.map(params => {
      this.id = +params['id'];
      return this.id;
    }).filter((id) => !!id)
      .switchMap((id) => this.store.select((state) => getEmail(state, id))).take(1).subscribe((email) => {
      this.email = email;
      this.html = email.html;
      this.emailTitle = email.title;

      this.store.select((state) => getVideo(state, email.video_id)).take(1).subscribe((video) => {
        this.selectedVideo = video;

        // check if gif was selected or poster
        const parser = new DOMParser();
        let doc: any; // defined as any to diable lint errors
        doc = parser.parseFromString(this.html, 'text/html');
        this.includeGif = this.selectedVideo.gif &&
          doc.querySelector('.video-poster').getAttribute('src') === this.selectedVideo.gif;
      });

      if (!email.cta_id || email.cta_id === 0) {
        this.nullCtaSelected = true;
        this.selectedCta = null;
      } else {
        this.store.select((state) => getCta(state, email.cta_id)).take(1).subscribe((cta) => {
          this.selectedCta = cta;
        });
      }

      this.selectedIndex = 4;
    });

    if (this.route.snapshot.queryParams.video) {
      this.store.select((state) => getVideo(state, this.route.snapshot.queryParams.video)).take(1).subscribe((video) => {
        this.selectedVideo = video;
        this.next();
      });
    }
  }

  updateHtml() {
    if (!this.selectedVideo || !this.html) {
      return;
    }

    const emailId = this.email ? this.email.id : 'EMAIL_ID';
    let videoLink;
    if (!this.selectedCta) {
      videoLink = environment.videoBaseUrl + this.selectedVideo.namespace;
    } else {
      videoLink = environment.videoBaseUrl + this.selectedVideo.namespace + '?cta='
        + this.selectedCta.namespace + '?utm_value=' + emailId + '&utm_source=email&play=true';
    }


    const image = this.includeGif && this.selectedVideo.gif ? this.selectedVideo.gif : this.selectedVideo.thumbnail;

    const parser = new DOMParser();
    let doc: any; // defined as any to diable lint errors
    doc = parser.parseFromString(this.html, 'text/html');
    doc.querySelectorAll('.video-link').forEach(x => x.setAttribute('href', videoLink));
    doc.querySelectorAll('.video-poster').forEach(x => x.setAttribute('src', image));
    this.html = doc.documentElement.innerHTML;
    this.htmlChanged = true;
  }

  ngOnDestroy() {
    this.isAlive = false;
  }


  videoSelected(video: Video) {
    if (!this.selectedVideo || (this.selectedVideo.id !== video.id)) {
      this.selectedVideo = video;
      this.includeGif = !!this.selectedVideo.gif;
      this.updateHtml();
    }
    this.next();
  }

  ctaSelected(cta?: Cta) {
    if (!cta && !this.nullCtaSelected) {
      this.nullCtaSelected = true;
      this.selectedCta = null;
      this.updateHtml();
    }
    if (!this.selectedCta || (this.selectedCta.id !== cta.id)) {
      this.nullCtaSelected = false;
      this.selectedCta = cta;
      this.updateHtml();
    }
    this.next();
  }

  templateSelected(template: Template) {
    if (!this.selectedTemplate || (this.selectedTemplate.id !== template.id)) {
      this.selectedTemplate = template;
      this.html = template.html;
      this.updateHtml();
    }
    this.next();
  }

  accountSelected(account: Account) {
    this.selectedAccount = account;
    this.next();
  }

  next() {
    this.selectedIndex++;
  }

  gifToggle(checked: boolean) {
    this.html = this.templateEditor.getHtml();
    this.includeGif = checked;
    this.updateHtml();
  }

  save(title: string) {
    this.emailTitle = title;
    this.html = this.templateEditor.getHtml();
    this.htmlChanged = true;
    this.next();

    // actually saving happen setter of selectedIndex when it changes to 5 or 6
  }

  storeEmail(data: any) {
    this.service.storeEmail(data).subscribe(
      (response) => {
        this.saving = false;
        this.email = response;
      }, (error) => {
        this.htmlChanged = true;
        this.saving = false;
        this.alertService.error(error.message);
      });
  }

  updateEmail(data: any) {
    if (!data.cta_id) {
      data.cta_id = 0;
    }
    this.service.updateEmail(this.email.id, data).subscribe((response) => {
      this.saving = false;
      this.email = response;
    }, (error) => {
      this.htmlChanged = true;
      this.saving = false;
      this.alertService.error(error.message);
    });
  }

  addVideo() {
    this.router.navigate(['/videos/add'], {queryParams: {route: this.id ? 'emails/send/' + this.id : 'emails/send'}});
  }
}

