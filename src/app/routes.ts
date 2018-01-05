import {Routes} from '@angular/router';
import {LoginComponent} from './components/login';
import {DashboardComponent} from './containers/dashboard';
import {AuthGuard} from './guards/auth';
import {AnonymousGuard} from './guards/anonymous';
import {NotFoundComponent} from './components/not-found';
import {BootstrapGuard} from './guards/bootstrap';
import {BootstrapComponent} from './containers/bootstrap';
import {SignupComponent} from './components/signup';
import {ForgetPasswordComponent} from './components/forget password';
import {LogoutComponent} from './components/logout';
import {SettingsComponent} from './components/settings';

import {ListTemplatesComponent} from './components/list-templates';

import {ManageVideoPageComponent} from './containers/manage-video-page';
import {AddVideoComponent} from './components/add-video';
import {ManageCtaPageComponent} from './containers/manage-cta-page';
import {ComposeEmailComponent} from './components/compose-email';
import {EditTemplateComponent} from './containers/edit-template';
import {EditVideoComponent} from './components/edit-video';
import {ManageAccountPageComponent} from './containers/manage-account';
import {CustomFormComponent} from './components/cta-custom-form';
import {ShareVideoComponent} from './components/video-share';
import {CtaCustomFormStatsComponent} from './components/cta-custom-form-stats';
import {EmailStatsComponent} from './components/email-stats';
import {ManageEmailPageComponent} from './containers/manage-emails.page';
import {ResetPasswordComponent} from './components/reset-password';
import {UpgradeComponent} from './components/upgrade';
import {PaidPlanGuard} from './guards/paid-plan';
import {SignupValidatorComponent} from './components/signup-validator';
import {PlansComponent} from './components/plans';
import {SignupPaidUserComponent} from './components/signup-paid-user';
import {AddNewCtaComponent} from './components/add-new-cta';
import {OnboardingComponent} from './components/onboarding/onboarding';
import {YoutubeOnboardComponent} from './components/onboarding/youtube-onboard';
import {EmailOnboardComponent} from './components/onboarding/email-onboard';
import {AddNewAccountComponent} from './components/add-new-account';
import {CtaOnboardComponent} from './components/onboarding/cta-onboard';
import {OnboardingCompleteGuard} from './guards/onboarding-complete';
import {OnboardingIncompleteGuard} from './guards/onboarding-incomplete';


export const routes: Routes = [
  {path: '', component: BootstrapComponent, canActivate: [BootstrapGuard]},
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard, OnboardingCompleteGuard],
    children: [
      {
        path: 'templates', component: ListTemplatesComponent
      },
      {
        path: 'templates/:id', component: EditTemplateComponent
      },
      {
        path: 'videos', component: ManageVideoPageComponent
      },
      {
        path: 'videos/add', component: AddVideoComponent, canActivate: [PaidPlanGuard]
      },
      {
        path: 'settings', component: SettingsComponent
      },
      {
        path: 'ctas', component: ManageCtaPageComponent
      },
      {
        path: 'ctas/custom-form', component: CustomFormComponent
      },
      {
        path: 'ctas/custom-form/:id', component: CustomFormComponent
      },
      {
        path: 'ctas/custom-form/stats/:id', component: CtaCustomFormStatsComponent
      },
      {
        path: 'emails', component: ManageEmailPageComponent
      },
      {
        path: 'accounts', component: ManageAccountPageComponent
      },
      {
        path: 'accounts/add', component: AddNewAccountComponent
      },
      {
        path: 'videos/:id', component: EditVideoComponent
      },
      {
        path: 'videos/share/:id', component: ShareVideoComponent
      },
      {
        path: 'emails/send', component: ComposeEmailComponent
      },
      {
        path: 'emails/send/:id', component: ComposeEmailComponent
      },
      {
        path: 'emails/stats/:id', component: EmailStatsComponent
      },
      {
        path: 'upgrade', component: UpgradeComponent
      },
      {
        path: 'ctas/add', component: AddNewCtaComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard, OnboardingIncompleteGuard],
    children: [
      {
        path: 'onboard', component: OnboardingComponent
      },
      {
        path: 'onboard/step/1', component: YoutubeOnboardComponent
      },
      {
        path: 'onboard/step/2', component: EmailOnboardComponent
      },
      {
        path: 'onboard/step/3', component: CtaOnboardComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [AnonymousGuard],
    children: [
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'signup', component: SignupComponent
      },
      {
        path: 'password/forget', component: ForgetPasswordComponent
      },
      {
        path: 'password/reset/:code', component: ResetPasswordComponent
      },
      {
        path: 'verify/:code', component: SignupValidatorComponent
      },
      {
        path: 'plans', component: PlansComponent
      },
      {
        path: 'user/register/:code', component: SignupPaidUserComponent
      }

    ]
  },
  {path: 'logout', component: LogoutComponent},
  {path: '**', component: NotFoundComponent}
];
