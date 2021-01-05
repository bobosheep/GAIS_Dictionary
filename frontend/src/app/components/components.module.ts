import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TermComponent } from './term.component';
import { ExtensionFormComponent } from './extension-form.component';
import { SharedModule } from '../shared.module';

@NgModule({
 imports:      [ SharedModule ],
 declarations: [ TermComponent, ExtensionFormComponent],
 exports:      [ TermComponent, ExtensionFormComponent]
})
export class ComponentsModule { }