import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { ComponentsModule } from '../components/components.module';

import { DictComponent } from './dict.component';
import { DictHomeComponent } from './dict-home/dict-home.component';
import { DictRoutingModule } from './dict-routing.module';
import { DictDetailComponent } from './dict-detail/dict-detail.component';
import { DictViewComponent } from './dict-view/dict-view.component';
import { DictNewWordComponent } from './dict-new-word/dict-new-word.component';
import { DictNWDComponent } from './dict-nwd/dict-nwd.component';
import { TermService } from '../services/term.service';
import { NWDService } from '../services/nwd.service';



@NgModule({
    declarations: [
        DictComponent,
        DictHomeComponent,
        DictDetailComponent,
        DictViewComponent,
        DictNWDComponent,
        DictNewWordComponent
    ],
    imports: [
        DictRoutingModule,
        SharedModule,
        ComponentsModule
    ], 
    providers: [
        TermService, NWDService
    ],
    entryComponents: [ ]
})
export class DictionaryModule {
  constructor() {
  }
}
