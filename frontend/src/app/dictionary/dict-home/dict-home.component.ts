import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TermService } from 'src/app/services/term.service';

@Component({
  selector: 'app-dict-home',
  templateUrl: './dict-home.component.html',
  styleUrls: ['./dict-home.component.css']
})
export class DictHomeComponent implements OnInit {

//   categories: Array<Category> = [];
//   isOpen: boolean[] = []

  constructor(private ts: TermService, private route: Router) { 
  }

  searchTerm: string = '';
  total_terms: number = 0;
  total_unchecks:  number = 0;
  update_time: number ;

  ngOnInit() {
    // this.update_time = Date.now();
    this.ts.getTermStat().subscribe((ret) => {
      let data = ret.data
      console.log(data)
      this.update_time = data.last_updated
      this.total_terms = data.total_term
      this.total_unchecks = data.total_uncheck
    })
  }
 
  search() {
    if (this.searchTerm !== '') {
      this.route.navigateByUrl(`/dictionary/${this.searchTerm}`)
    }
  }
}
