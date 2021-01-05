import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

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
  term_not_found: boolean = false;

  constructor(private route: ActivatedRoute, private ts: TermService,
              private location: Location) { 
    this.route.params.subscribe((param) => {
      this.term_name = param['term']
      this.getTerm(this.term_name)

    })
    
  }

  ngOnInit() {
  }
  
  getTerm(term) {
    this.term_not_found = false;
    this.ts.getTerm(term).subscribe((ret) => {
      this.term = ret.data
      console.log(this.term)
    }, (error) => {
      console.log(error)
      if(error.status === 404){
        this.term_not_found = true
      }
    })

  }

  goBack(){
    this.location.back()
  }

}
