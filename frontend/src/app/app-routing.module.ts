import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResultComponent } from './components/search_results/search-result.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './page-not-found/not-found.component';
import { CanActivateAdmin } from './services/admin.service';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'category', 
    loadChildren: () => import('./category/cat.module').then(m => m.CategoryModule)
  },
  { path: 'dictionary', 
    loadChildren: () => import('./dictionary/dict.module').then(m => m.DictionaryModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin',
    canActivate: [CanActivateAdmin],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'search',
    component: SearchResultComponent
  },
  { path: 'user', 
    children: [
      { path: 'profile', component: ProfileComponent }
    ]
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
