import { NgModule } from '@angular/core';

import { DocumentRoutingModule } from './document.routing';
import { DocumentsComponent } from './documents/documents.component';

@NgModule({
    declarations: [
        DocumentsComponent
    ],
    imports: [
        DocumentRoutingModule
    ]
})
export class DocumentModule {
    
}
