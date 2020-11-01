import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminTermsComponent } from './admin-terms/admin-terms.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{
        path: 'dashboard',
        component:  AdminDashboardComponent
      },{
        path: 'users',
        component:  AdminUsersComponent
      },{
        path: 'categories',
        component:  AdminCategoriesComponent
      },{
        path: 'terms',
        component: AdminTermsComponent
      }, {
        path: '',
        redirectTo: 'dashboard'
      }
        
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}
