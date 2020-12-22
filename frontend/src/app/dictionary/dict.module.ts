import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { httpInterceptorProviders } from '../services/auth.service';
import { DictComponent } from './dict.component';
import { DictHomeComponent } from './dict-home/dict-home.component';
import { DictRoutingModule } from './dict-routing.module';
import { DictDetailComponent } from './dict-detail/dict-detail.component';
import { DictViewComponent } from './dict-view/dict-view.component';
import { DictNewWordComponent } from './dict-new-word/dict-new-word.component';
import { DictNWDComponent } from './dict-nwd/dict-nwd.component';
import { DictSearchComponent } from './dict-search/dict-search.component';
import { TermService } from '../services/term.service';



@NgModule({
    declarations: [
        DictComponent,
        DictHomeComponent,
        DictDetailComponent,
        DictViewComponent,
        DictNWDComponent,
        DictNewWordComponent,
        DictSearchComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        DictRoutingModule,
        NzMenuModule,
        NzPageHeaderModule,
        NzBreadCrumbModule,
        NzButtonModule,
        NzDescriptionsModule,
        NzDividerModule,
        NzSwitchModule,
        NzIconModule,
        NzToolTipModule,
        NzModalModule,
        NzMessageModule,
        NzInputModule,
        NzStatisticModule,
        NzTabsModule
    ], 
    providers: [
        TermService, httpInterceptorProviders
    ],
    entryComponents: [ ]
})
export class DictionaryModule {
  constructor() {
  }
}
