import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { SearchResultComponent } from './search-result.component';
import { SearchService } from './search.service';

@NgModule({
 imports:      [ SharedModule ],
 declarations: [ SearchResultComponent ],
 exports:      [ SearchResultComponent ],
 providers: [ SearchService ],
})
export class SearchModule { }