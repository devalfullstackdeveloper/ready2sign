import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { NgxDataTableModule} from "angular-9-datatable";
import { SettingsComponent } from './settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../core/guard/auth.guard'
import { SignaturePadModule } from 'ngx-signaturepad';
import { NgxPaginationModule } from 'ngx-pagination';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TemplatesComponent } from './templates/templates.component';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxSelectModule } from 'ngx-select-ex';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import {NgxPrintModule} from 'ngx-print';
import { SentDocumentComponent } from './sent-document/sent-document.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule,} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { NgxSpinnerModule } from "ngx-spinner";
import { ClickOutsideModule } from 'ng-click-outside';
import {DpDatePickerModule} from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { BoldSpanPipe } from '../../core/validators/bold-span.pipe'
import { SafeHtmlPipe } from '../../core/validators/safe-html.pipe'

@NgModule({
    declarations: [
        DashboardComponent,
        HomeComponent,
        SidebarComponent,
        SettingsComponent,
        TemplatesComponent,
        EditTemplateComponent,
        EditDocumentComponent,
        SentDocumentComponent,
        MyProfileComponent,
        // SafeHtmlPipe
    ],
    imports: [
        MatButtonToggleModule,
        FormsModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatTableModule,
        HomeRoutingModule,
        FormsModule,
        CommonModule,
        CoreModule,
        NgxDataTableModule,
        ReactiveFormsModule,
        SignaturePadModule,
        NgxPaginationModule,
        DragDropModule,
        NgxFileDropModule,
        NgxSelectModule,
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
        NgxPrintModule,
        NgxSpinnerModule,
        ClickOutsideModule,
        DpDatePickerModule,
        NgSelectModule,
        Ng2TelInputModule,
        NgxMaterialTimepickerModule,
        // BoldSpanPipe
    ],
    providers:[
      {provide : AuthGuard, useClass: AuthGuard}
    ]
})
export class HomeModule {}
