import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDescriptionsModule, NzIconModule, NzPageHeaderModule, NzTableModule, NzTabsModule } from 'ng-zorro-antd';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';


import { AdminRoutingModule } from  './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminTermsComponent } from './admin-terms/admin-terms.component';
import { AdminUsersComponent, AdminUsersTableComponent } from './admin-users/admin-users.component';
import { AdminService } from '../services/admin.service';
import { httpInterceptorProviders } from '../services/auth.service';



@NgModule({
    declarations: [
        AdminComponent,
        AdminDashboardComponent,
        AdminCategoriesComponent,
        AdminTermsComponent,
        AdminUsersComponent,
        AdminUsersTableComponent
    ],
    imports: [
        AdminRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        NzMenuModule,
        NzIconModule,
        NzGridModule,
        NzStatisticModule,
        NzPageHeaderModule,
        NzDescriptionsModule,
        NzTabsModule,
        NzTableModule
    ], 
    providers: [AdminService, httpInterceptorProviders],
    entryComponents: []
})
export class AdminModule {
  constructor() {
  }
}