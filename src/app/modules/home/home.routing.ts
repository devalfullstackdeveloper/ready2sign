import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings/settings.component';
import { TemplatesComponent } from './templates/templates.component';
import { AuthGuard } from '../../core/guard/auth.guard';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { SentDocumentComponent } from './sent-document/sent-document.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { Role } from '../../data/model/user/role';

export const routes: Routes = [
  {
    path:'',
    // canActivate: [AuthGuard],
    // component : HomeComponent,
    children:[
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardComponent,
        // canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.Manager,Role.Standard] },
        children:[
          { path : '', redirectTo:'/admin/home/All', pathMatch:'full'},
          { path : 'Drafts',component : DashboardComponent },
          { path : 'Sent',component : DashboardComponent },
          { path : 'Withdrawn',component : DashboardComponent },
          { path : 'Completed',component : DashboardComponent },
          { path : 'Expired',component : DashboardComponent },
          { path : 'Approval',component : DashboardComponent },
          { path : 'Rejected',component : DashboardComponent },
          { path : 'All',component : DashboardComponent }
        ]
      },
      {
        path:'settings',
        component:SettingsComponent,
        // canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
        children:[
          { path : '', redirectTo:'/admin/settings/CompanyProfile', pathMatch:'full'},
          { path : 'CompanyProfile',component : SettingsComponent },
          { path : 'Users',component : SettingsComponent },
          { path : 'Groups',component : SettingsComponent },
          { path : 'ConnectedApps',component : SettingsComponent },
          { path : 'Subscription',component : SettingsComponent },
          { path : 'Support',component : SettingsComponent }
        ]
      },
      {
        path:'templates',
        component:TemplatesComponent,
        // canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.Manager] },
        children:[
          { path : '', redirectTo:'/admin/templates/Published', pathMatch:'full'},
          { path : 'All',component : TemplatesComponent },
          { path : 'Drafts',component : TemplatesComponent },
          { path : 'Published',component : TemplatesComponent },
          { path : 'Archived',component : TemplatesComponent },
        ]
      },
      {
        path:'editTemplate/:id',
        component:EditTemplateComponent,
        // canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.Manager] },
      },
      {
        path:'editDocument/:id',
        component:EditDocumentComponent,
        data: { roles: [Role.Admin,Role.Manager,Role.Standard] },
      },
      {
        path:'sentDocument/:id',
        component:SentDocumentComponent,
        data: { roles: [Role.Admin,Role.Manager,Role.Standard] },
      },
      {
        path:'myProfile',
        component: MyProfileComponent
      },
      {
        path:'**',
        redirectTo: 'home'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class HomeRoutingModule {}
