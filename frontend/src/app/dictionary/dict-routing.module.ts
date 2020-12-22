import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

import { CanActivateEdition } from '../services/auth.service';
import { DictDetailComponent } from './dict-detail/dict-detail.component';
import { DictHomeComponent } from './dict-home/dict-home.component';
import { DictViewComponent } from './dict-view/dict-view.component';
import { DictNWDComponent } from './dict-nwd/dict-nwd.component';
import { DictComponent } from  './dict.component'


const DictRoutes: Routes = [
  {
    path: '',
    component: DictComponent,
    children: [
      {
        path: '',
        component:  DictHomeComponent
      },{
        path: 'view',
        children: [
          {
            path: ':wlen',
            component: DictViewComponent
          },{
            path: '',
            component: DictViewComponent
          }
        ]
      },{
        path: 'nwd',
        component: DictNWDComponent,
        children : [
          {
            path: ':action',
            component: DictNWDComponent
          }
        ]
      },{
        path: 'search',
        component: DictNWDComponent
    //   },{
    //     path: 'edit',
    //     canActivate: [CanActivateEdition],
    //     component: CatEditComponent,
    //     children: [
    //       {
    //         path: ':category',
    //         children: [
    //          { path: ':subcategory', component: CatDetailComponent },
    //          { path: '', component: CatDetailComponent }
    //         ]
    //       }
    //     ]
      },{
        path: ':term',
        children: [
        //  { path: ':subcategory', component: CatDetailComponent },
         { path: '', component: DictDetailComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(DictRoutes)
  ],
  providers: [CanActivateEdition],
  exports: [
    RouterModule
  ]
})
export class DictRoutingModule {}
