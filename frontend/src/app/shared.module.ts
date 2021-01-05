import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { NZ_I18N, zh_TW, en_US } from 'ng-zorro-antd';
import { NzIconModule, NZ_ICON_DEFAULT_TWOTONE_COLOR } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzEmptyModule } from 'ng-zorro-antd/empty';


import { AppRoutingModule } from './app-routing.module';
import { AuthService, httpInterceptorProviders } from './services/auth.service';
import { UserModule } from './user/user.module';
import { CanActivateAdmin } from './services/admin.service';

registerLocaleData(en);



@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzLayoutModule,
    NzMenuModule, 
    NzIconModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzSwitchModule,
    NzToolTipModule,
    NzModalModule,
    NzMessageModule,
    NzInputModule,
    NzStatisticModule,
    NzTabsModule,
    NzUploadModule,
    NzTableModule,
    NzListModule,
    NzSkeletonModule,
    NzEmptyModule
  ],
  providers: [
    AuthService, 
    httpInterceptorProviders, 
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#9b4dca' },
    CanActivateAdmin
  ]
})
export class SharedModule {}
