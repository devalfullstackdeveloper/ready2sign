import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DataModule } from './data/data.module';
import { CoreModule } from './core/core.module';
import { ProgressBarModule } from "angular-progress-bar"
import { FooterComponent } from './layout/footer/footer.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { LoginComponent } from './modules/login/login.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { TestComponent } from './test/test.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SignUpComponent } from './modules/sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordConformationComponent } from './modules/password-conformation/password-conformation.component';
import { ToastrModule } from 'ngx-toastr';
import { SignaturePadModule } from 'ngx-signaturepad';
import { SentSignInPersonComponent } from './sent-sign-in-person/sent-sign-in-person.component';
import { MapApiService } from './core/service/mapApi.service';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DpDatePickerModule} from 'ng2-date-picker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxFileDropModule } from 'ngx-file-drop';
import { WebcamModule } from 'ngx-webcam';
import { AuthGuard } from './core/guard/auth.guard';
import { RecaptchaModule,RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { WithdrawThankYouComponent } from './withdraw-thank-you/withdraw-thank-you.component';
// import { SafeHtmlPipe } from './core/validators/safe-html.pipe'

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    FooterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    TestComponent,
    SignUpComponent,
    ResetPasswordComponent,
    PasswordConformationComponent,
    SentSignInPersonComponent,
    ThankYouComponent,
    WithdrawThankYouComponent,
    // SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    DataModule,
    CoreModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    SignaturePadModule,
    Ng2TelInputModule,
    NgxFileDropModule,
    MatCheckboxModule,
    DpDatePickerModule,
    NgxMaterialTimepickerModule,
    WebcamModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ProgressBarModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
  ],
  providers: [
    MapApiService,
    {
      provide: AuthGuard,
      useClass: AuthGuard
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Lc_J4caAAAAALzfee1fGb2xz6hjxfq8O3s8Jy10',
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
