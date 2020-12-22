import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TermDetail } from 'src/app/interfaces/term';
import { TermService } from 'src/app/services/term.service';

@Component({
  selector: 'app-dict-detail',
  templateUrl: './dict-detail.component.html',
  styleUrls: ['./dict-detail.component.css']
})
export class DictDetailComponent implements OnInit {

  // term 
  term_name: string;
  term: TermDetail;
  view_cnt: number;
  edit_cnt: number;
  last_updated: number;

  constructor(private route: ActivatedRoute, private ts: TermService) { 
    this.route.params.subscribe((param) => {
      this.term_name = param['term']
      this.ts.getTerm(this.term_name).subscribe((ret) => {
        this.term = ret.data
        console.log(this.term)
      })

    })
    
  }

  ngOnInit() {
    this.view_cnt = 9487
    this.edit_cnt = 123
    this.last_updated = Date.now()
  }
 

}
