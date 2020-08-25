import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../../core/guard/auth.guard'

export const routes: Routes = [
  {
    path:'',
    canActivate: [AuthGuard],
    // component : HomeComponent,
    children:[
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path:'settings',
        component:SettingsComponent
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
