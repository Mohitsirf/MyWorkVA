import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './containers/app.component';
import {LoginComponent} from './components/login';
import {VaetasService} from './services/vaetas';
import {RouterModule} from '@angular/router';
import {routes} from './routes';
import {LayoutMainComponent} from './components/layouts/main';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './containers/header';
import {AddCardComponent} from './components/add-card';
import {FlexAlignmentHackDirective} from './directives/flex-alignment-hack';
import {DashboardComponent} from './containers/dashboard';
import {AuthGuard} from './guards/auth';
import {AnonymousGuard} from './guards/anonymous';
import {NotFoundComponent} from './components/not-found';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStoreModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {reducer} from './reducers';
import {BootstrapComponent} from './containers/bootstrap';
import {BootstrapGuard} from './guards/bootstrap';
import {CentreSpinnerComponent} from './components/centre-spinner';
import {ErrorComponent} from './components/error';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VideoCardComponent} from './components/video-card';
import {SearchBarComponent} from './components/search-bar';
import {VideoListComponent} from './components/video-list';
import {ImageLayoutComponent} from './components/layouts/va-img-layout';
import {HomePageComponent} from './containers/home';
import {AddCTAPageComponent} from './containers/add-cta';

import {EmailVerificationComponent} from './containers/email-verification';
import {SignupComponent} from './components/signup';
import {TruncatePipe} from './pipes/truncate';
import {SecondsToTimePipe} from './pipes/seconds-to-time';
import {ForgetPasswordComponent} from './components/forget password';
import {ConfirmationDialogComponent} from './components/confirmation-dialog-component';
import {ColorPickerModule} from 'angular4-color-picker';
import {LogoutComponent} from './components/logout';
import {TemplateEditorComponent} from './components/template-editor';
import {FormBuilderComponent} from './components/form-builder';
import {YoutubeService} from './services/youtube';
import {SettingsComponent} from './components/settings';
import {ProfileSettingsComponent} from './components/profile-settings';
import {BillingComponent} from './components/billing';
import {AddVideoComponent} from './components/add-video';
import {UploadFromDiskComponent} from 'app/components/upload-from-disk';
import {RecordWebcamComponent} from './components/record-webcam';
import {YoutubeLinkComponent} from 'app/components/paste-youtube-link';
import {ListTemplatesComponent} from './components/list-templates';
import {ManageVideoPageComponent} from './containers/manage-video-page';
import {TemplateThumbnailComponent} from './components/template-thumbnail';
import {AddCtaPageComponent} from './components/add-cta';
import {ManageCtaPageComponent} from './containers/manage-cta-page';
import {AutoForwardCtaComponent} from './components/auto-forward-component';
import {CallCtaComponent} from './components/cta-call-component';
import {DownloadFileCtaComponent} from './components/cta-download-file-component';
import {ComposeEmailComponent} from './components/compose-email';
import {CTACardComponent} from './components/cta-card';
import {CTAListComponent} from './components/cta-list';
import {YouTubeUploadComponent} from './components/youtube-upload';
import {SendEmailCtaCardComponent} from './components/sendemail-cta-card';
import {VideoSelectComponent} from './components/video-select';
import {SendEmailCtaSelectComponent} from './components/cta-select';
import {EditTemplateComponent} from './containers/edit-template';
import {TemplateSelectComponent} from './components/template-select';
import {TemplateCardComponent} from './components/template-card';
import {EmailTemplateEditComponent} from './components/email-template-edit';
import {ManageAccountPageComponent} from 'app/containers/manage-account';
import {AccountCardComponent} from './components/account-card';
import {AddAccountPageComponent} from './components/account-list';
import {EditVideoComponent} from './components/edit-video';
import {CustomFormComponent} from './components/cta-custom-form';
import {GetResponseAccountComponent} from './components/accounts/getresponse-account';
import {MailChimpAccountComponent} from './components/accounts/mailchimp-account';
import {SendEmailAccountSelectComponent} from './components/account-select';
import {IContactAccountComponent} from './components/accounts/icontact-account';
import {SendEmailAccountCardComponent} from 'app/components/sendemail-account-card';
import {MailChimpDeployComponent} from './components/deploys/mailchimp-deployment';
import {ConstantContactDeployComponent} from './components/deploys/constantContact-deployment';
import {GetResponseDeployComponent} from './components/deploys/getResponse-deployment';
import {IContactDeployComponent} from './components/deploys/iContact-deployment';
import {ShareVideoComponent} from './components/video-share';
import {VideoDeleteComponent} from './components/video-delete';
import {EmailListComponent} from './components/email-list';
import {EmailCardComponent} from 'app/components/email-card';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {AlertService} from './services/alert';
import {OAuthAccountDeleteComponent} from './components/accounts/delete-oauth-account';

import {EmailMeCtaComponent} from './components/cta_email_me';
import {CustomHtmlCtaComponent} from './components/cta_custom_html';
import {CtaCustomFormStatsComponent} from 'app/components/cta-custom-form-stats';
import {EmailStatsComponent} from './components/email-stats';
import {ManageEmailPageComponent} from './containers/manage-emails.page';
import {GoogleDeployComponent} from './components/deploys/google-deployment';
import {OutlookDeployComponent} from './components/deploys/outlook-deployment';
import {AweberDeployComponent} from './components/deploys/aweber-deployment';
import {FilterStringPipe} from './pipes/filter-strings';
import {EmailDeleteComponent} from './components/email-delete-confirmation';
import {VideoPlayStatsComponent} from './components/video-play-stats';
import {VideoOpenStatsComponent} from './components/video-open-stats';
import {CtaStatsComponent} from './components/cta-stats';
import {SendEmailComponent} from './components/send-email';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {ResendConfirmationComponent} from './components/resend-confirmation';
import {ResetPasswordComponent} from './components/reset-password';
import {EmailsInputComponent} from './components/emails-input';
import {HttpClientModule} from '@angular/common/http';
import {UpgradeComponent} from './components/upgrade';
import {PaidPlanGuard} from './guards/paid-plan';
import {SignupValidatorComponent} from './components/signup-validator';
import {PlansComponent} from './components/plans';
import {PaidVerificationSentComponent} from './components/paid-verification-sent';
import {SignupPaidUserComponent} from './components/signup-paid-user';
import {AddNewCtaComponent} from './components/add-new-cta';
import {CtaNoneCardComponent} from './components/cta-none-card';
import {OnboardingComponent} from './components/onboarding/onboarding';
import {ProgressBarComponent} from './components/onboarding/progress-bar';
import {YoutubeOnboardComponent} from './components/onboarding/youtube-onboard';
import {EmailOnboardComponent} from './components/onboarding/email-onboard';
import {AddNewAccountComponent} from './components/add-new-account';
import {SafeUrlPipe} from './pipes/safe-url';
import {IntercomModule} from 'ng-intercom';
import {CtaOnboardComponent} from './components/onboarding/cta-onboard';
import {OnboardingCompleteGuard} from './guards/onboarding-complete';
import {OnboardingIncompleteGuard} from './guards/onboarding-incomplete';
import {NewCtaCardComponent} from './components/new-cta-card';
import {NewAccountCardComponent} from './components/new-account-card';
import {environment} from '../environments/environment';
import {EmailCloneTitleComponent} from './components/email-clone-title';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    LayoutMainComponent,
    HeaderComponent,
    AddCardComponent,
    DashboardComponent,
    NotFoundComponent,
    FlexAlignmentHackDirective,
    BootstrapComponent,
    CentreSpinnerComponent,
    ManageVideoPageComponent,
    ErrorComponent,
    VideoCardComponent,
    SearchBarComponent,
    VideoListComponent,
    ImageLayoutComponent,
    HomePageComponent,
    AddCTAPageComponent,
    EmailVerificationComponent,
    AddVideoComponent,
    UploadFromDiskComponent,
    RecordWebcamComponent,
    YoutubeLinkComponent,
    SignupComponent,
    TruncatePipe,
    SecondsToTimePipe,
    ForgetPasswordComponent,
    SignupComponent,
    LogoutComponent,
    TemplateEditorComponent,
    FormBuilderComponent,
    SettingsComponent,
    ProfileSettingsComponent,
    BillingComponent,
    ListTemplatesComponent,
    TemplateThumbnailComponent,
    AddCtaPageComponent,
    ManageCtaPageComponent,
    AutoForwardCtaComponent,
    CallCtaComponent,
    DownloadFileCtaComponent,
    ListTemplatesComponent,
    TemplateThumbnailComponent,
    ComposeEmailComponent,
    CTACardComponent,
    SendEmailCtaCardComponent,
    SendEmailCtaSelectComponent,
    TemplateSelectComponent,
    CTAListComponent,
    YouTubeUploadComponent,
    VideoSelectComponent,
    TemplateCardComponent,
    EditTemplateComponent,
    EmailTemplateEditComponent,
    ManageAccountPageComponent,
    AccountCardComponent,
    AddAccountPageComponent,
    EditVideoComponent,
    CustomFormComponent,
    MailChimpAccountComponent,
    GetResponseAccountComponent,
    IContactAccountComponent,
    SendEmailAccountSelectComponent,
    SendEmailAccountCardComponent,
    MailChimpDeployComponent,
    ConstantContactDeployComponent,
    GetResponseDeployComponent,
    IContactDeployComponent,
    ShareVideoComponent,
    VideoDeleteComponent,
    EmailMeCtaComponent,
    CustomHtmlCtaComponent,
    EmailListComponent,
    EmailCardComponent,
    CtaCustomFormStatsComponent,
    OAuthAccountDeleteComponent,
    EmailStatsComponent,
    ManageEmailPageComponent,
    GoogleDeployComponent,
    OutlookDeployComponent,
    AweberDeployComponent,
    FilterStringPipe,
    EmailDeleteComponent,
    VideoPlayStatsComponent,
    VideoOpenStatsComponent,
    CtaStatsComponent,
    SendEmailComponent,
    ResendConfirmationComponent,
    ResetPasswordComponent,
    EmailsInputComponent,
    UpgradeComponent,
    SignupValidatorComponent,
    PlansComponent,
    PaidVerificationSentComponent,
    SignupPaidUserComponent,
    AddNewCtaComponent,
    CtaNoneCardComponent,
    OnboardingComponent,
    ProgressBarComponent,
    YoutubeOnboardComponent,
    EmailOnboardComponent,
    AddNewAccountComponent,
    SafeUrlPipe,
    CtaOnboardComponent,
    NewCtaCardComponent,
    NewAccountCardComponent,
    EmailCloneTitleComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    ColorPickerModule,
    ShareButtonsModule.forRoot(),
    ClipboardModule,
    AngularMultiSelectModule,
    IntercomModule.forRoot({
      appId: environment.intercomAppId,
      updateOnRouterChange: true
    })
  ],
  providers: [VaetasService, AuthGuard, AnonymousGuard, BootstrapGuard, YoutubeService, AlertService, PaidPlanGuard,
    OnboardingCompleteGuard, OnboardingIncompleteGuard],
  entryComponents: [ConfirmationDialogComponent, YouTubeUploadComponent, MailChimpAccountComponent, AutoForwardCtaComponent,
    GetResponseAccountComponent, IContactAccountComponent, DownloadFileCtaComponent, VideoDeleteComponent, CallCtaComponent,
    EmailMeCtaComponent, CustomHtmlCtaComponent, OAuthAccountDeleteComponent, GoogleDeployComponent, OutlookDeployComponent,
    AweberDeployComponent, EmailDeleteComponent, ResendConfirmationComponent, PaidVerificationSentComponent, EmailCloneTitleComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
