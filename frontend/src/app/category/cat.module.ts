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

import { CategoryRoutingModule } from './cat-routing.module';
import { CatHomeComponent } from './cat-home/cat-home.component';
import { CatComponent } from './cat.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';
import { CatExtensionComponent, ExtensionModalComponent } from './cat-extension/cat-extension.component';
import { CanActivateEdition, CategoryService } from '../services/category.service';
import { CatDetailComponent } from './cat-detail/cat-detail.component';
import { httpInterceptorProviders } from '../services/auth.service';
import { TermComponent } from '../components/term.component';
import { ExtensionFormComponent } from '../components/extension-form.component';



@NgModule({
    declarations: [
        CatComponent,
        CatHomeComponent,
        CatEditComponent,
        CatDetailComponent,
        CatExtensionComponent,
        TermComponent,
        ExtensionFormComponent,
        ExtensionModalComponent
    ],
    imports: [
        CommonModule,
        CategoryRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
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
        NzMessageModule
    ], 
    providers: [
      CategoryService, httpInterceptorProviders, CanActivateEdition
    ],
    entryComponents: [ ExtensionModalComponent ]
})
export class CategoryModule {
  constructor() {
  }
}
