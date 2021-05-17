import { NgModule } from '@angular/core';
import { NzTreeModule } from 'ng-zorro-antd/tree'

import { CategoryRoutingModule } from './cat-routing.module';
import { CatHomeComponent } from './cat-home/cat-home.component';
import { CatComponent } from './cat.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';
import { CatExtensionComponent, ExtensionModalComponent } from './cat-extension/cat-extension.component';
import { CategoryService } from '../services/category.service';
import { CatDetailComponent } from './cat-detail/cat-detail.component';
import { httpInterceptorProviders, CanActivateEdition } from '../services/auth.service';
import { SharedModule } from '../shared.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [
        CatComponent,
        CatHomeComponent,
        CatEditComponent,
        CatDetailComponent,
        CatExtensionComponent,
        ExtensionModalComponent,
    ],
    imports: [
        CategoryRoutingModule,
        SharedModule,
        ComponentsModule,
        NzTreeModule
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
