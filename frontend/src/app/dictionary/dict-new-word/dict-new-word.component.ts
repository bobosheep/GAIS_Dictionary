import { Component, OnInit } from '@angular/core';
import { NewWord } from 'src/app/interfaces/new_word';
import { NWDService } from 'src/app/services/nwd.service';

@Component({
  selector: 'app-dict-new-word',
  templateUrl: './dict-new-word.component.html',
  styleUrls: ['./dict-new-word.component.css']
})
export class DictNewWordComponent implements OnInit {

    new_terms: NewWord[];
    reject_terms: NewWord[];
    accept_loading: boolean;
    reject_loading: boolean;

    constructor(private nwd: NWDService) {
        
    }

    ngOnInit(){
      this.loadStat(0);
      this.loadStat(1);
    }

    loadStat(num: number){
      if (num === 0) {
        this.accept_loading = true;
        this.nwd.getNewWordList(0, 50).subscribe((ret) => {
          this.new_terms = [...ret.datas];
          this.accept_loading = false;
        })
      } 
      else if (num === 1) {
        this.reject_loading = true;
        this.nwd.getRejectList(0, 50).subscribe((ret) => {
          this.reject_terms = [...ret.datas];
          this.reject_loading = false;
        })
      }
    }

}
