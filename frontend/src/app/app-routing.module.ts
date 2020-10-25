import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // { path: 'home', component: HomeComponent},
  // { path: 'category', 
  //   loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
  // },
  // { path: 'login', component: LoginComponent },
  // { path: '',   redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
