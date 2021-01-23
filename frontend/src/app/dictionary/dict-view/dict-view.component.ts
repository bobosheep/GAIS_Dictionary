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
                this.ts.getTermList(param.wlen, 0, 50).subscribe((ret) => {
                    this.term_datas = ret.datas
                })

            }
            else{
                this.ts.getTermList(0, 0, 10).subscribe((ret) => {
                    this.term_datas = ret.datas
                })
            }
        })

    }
    loadMore(idx) {
        let len: number;
        let page: number;
        let size: number;
        len = this.term_datas[idx].wlen;
        page = this.term_datas[idx].page + 1;
        size = this.term_datas[idx].size;
        
        this.ts.getTermList(len, page, size).subscribe((ret) => {
            this.term_datas[idx].data = [...this.term_datas[idx].data, ...ret.datas[0].data]
            this.term_datas[idx].page = ret.datas[0].page
        })
    }
}
