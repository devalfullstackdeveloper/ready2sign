import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DataModule } from './data/data.module';
import { CoreModule } from './core/core.module';
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
    PasswordConformationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    DataModule,
    CoreModule,
    ToastrModule.forRoot(),
    SignaturePadModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
