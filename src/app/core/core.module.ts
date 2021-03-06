import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { appInitializer } from './app.initilizer';
import { AuthenticationService } from './service/authentication.service';
import { CustomMinValidatorDirective } from './validators/custom-min-validator.directive';
import { CustomMaxValidatorDirective } from './validators/custom-max-validator.directive';
import { MatchPasswordDirective } from './validators/match-password.directive';
import { BoldSpanPipe } from './validators/bold-span.pipe';
import { HighlightDirective } from './validators/highlight.directive';
import { SafeHtmlPipe } from './validators/safe-html.pipe';


@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService] },
   ],
  declarations: [CustomMinValidatorDirective, CustomMaxValidatorDirective, MatchPasswordDirective, BoldSpanPipe, HighlightDirective, SafeHtmlPipe],
  exports :[CustomMinValidatorDirective, CustomMaxValidatorDirective, MatchPasswordDirective, HighlightDirective, BoldSpanPipe, SafeHtmlPipe]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {

  }
}
