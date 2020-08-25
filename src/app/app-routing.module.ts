import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { LoginComponent } from './modules/login/login.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordConformationComponent } from './modules/password-conformation/password-conformation.component'
import { SignUpComponent } from './modules/sign-up/sign-up.component'
import { TestComponent } from './test/test.component'
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './modules/home/home.component';


const routes: Routes = [
  { path: '', redirectTo:'/admin',pathMatch:'full'},
  { path:'test', component: TestComponent},
  { path: 'login', component: LoginComponent },
  { path: 'sign-up/:id',component: SignUpComponent },
  // { path: 'sign-up',component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'password-confirmation/:id1/:id2/:id3', component: PasswordConformationComponent },
  { path: 'password-confirmation', component: PasswordConformationComponent },
  { path: 'admin', component: HomeComponent ,canActivate :[AuthGuard], loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  // {
  //   path: '',
  //   component : HomeComponent,
  //   // component: ContentLayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadChildren: () =>
  //         import('./modules/home/home.module').then(m => m.HomeModule)
  //     },
  //     {
  //       path: 'document',
  //       loadChildren: () =>
  //         import('./modules/document/document.module').then(m => m.DocumentModule)
  //     },
  //   ]
  // }

];

@NgModule({
  imports: [[RouterModule.forRoot(routes, { useHash: false })]],
  exports: [RouterModule]
})
export class AppRoutingModule { }
