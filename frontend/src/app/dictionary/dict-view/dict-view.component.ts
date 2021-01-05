import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TermDetail } from 'src/app/interfaces/term';
import { TermService } from 'src/app/services/term.service';

@Component({
  selector: 'app-dict-view',
  templateUrl: './dict-view.component.html',
  styleUrls: ['./dict-view.component.css']
})
export class DictViewComponent implements OnInit {

    term_datas: any;
    constructor(private ts: TermService, private route: ActivatedRoute) {

    }

    ngOnInit(){
        this.route.params.subscribe((param) => {
            console.log(Object.values(param))
            if (param.wlen){
                let size = Math.floor(100 / param.wlen);
                this.ts.getTermList(param.wlen, 100).subscribe((ret) => {
                    this.term_datas = ret.datas
                })

            }
            else{
                this.ts.getTermList(0, 30).subscribe((ret) => {
                    this.term_datas = ret.datas
                })
            }
        })

    }
}
