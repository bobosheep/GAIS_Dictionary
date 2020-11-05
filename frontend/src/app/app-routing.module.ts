import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './page-not-found/not-found.component';
import { CanActivateAdmin } from './services/admin.service';
import { LoginComponent } from './user/login/login.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'category', 
    loadChildren: () => import('./category/cat.module').then(m => m.CategoryModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'admin',
    canActivate: [CanActivateAdmin],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [CanActivateAdmin],
  exports: [RouterModule]
})
export class AppRoutingModule { }
