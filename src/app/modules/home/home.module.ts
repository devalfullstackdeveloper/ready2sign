import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDataTableModule} from "angular-9-datatable";
import { SettingsComponent } from './settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../core/guard/auth.guard'
import { SignaturePadModule } from 'ngx-signaturepad';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [
        DashboardComponent,
        HomeComponent,
        SidebarComponent,
        SettingsComponent
    ],
    imports: [
        HomeRoutingModule,
        FormsModule,
        CommonModule,
        NgxDataTableModule,
        ReactiveFormsModule,
        SignaturePadModule,
        NgxPaginationModule
    ],
    providers:[
      {provide : AuthGuard, useClass: AuthGuard}
    ]
})
export class HomeModule {}
