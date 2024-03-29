import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

import { CatComponent } from './cat.component';
import { CatHomeComponent } from './cat-home/cat-home.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';
import { CatDetailComponent } from './cat-detail/cat-detail.component';
import { CatExtensionComponent } from './cat-extension/cat-extension.component';
import { CanActivateEdition } from '../services/auth.service';


const catRoutes: Routes = [
  {
    path: '',
    component: CatComponent,
    children: [
      {
        path: '',
        component:  CatHomeComponent
      }, {
        path: 'extension',
        component: CatExtensionComponent
      }, {
        path: 'edit',
        canActivate: [CanActivateEdition],
        component: CatEditComponent,
        children: [
          {
            path: ':category',
            children: [
             { path: ':subcategory', component: CatDetailComponent },
             { path: '', component: CatDetailComponent }
            ]
          }
        ]
      },{
        path: ':category',
        children: [
         { path: ':subcategory', component: CatDetailComponent },
         { path: '', component: CatDetailComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(catRoutes)
  ],
  providers: [CanActivateEdition],
  exports: [
    RouterModule
  ]
})
export class CategoryRoutingModule {}
