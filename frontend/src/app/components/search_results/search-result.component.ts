import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from './search.service';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html', 
    styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

    query: string;
    page: number = 0;
    size: number = 10;
    results: any = null;
    stat: string;
    constructor(private route: ActivatedRoute, private ss: SearchService,private router: Router) {

    }
    ngOnInit() {
        this.stat = 'init';
        this.query = '';
        this.route.queryParams.subscribe((param) => {
            console.log(param)
            if (param !== {}){
                this.query = param.q === undefined ? '' : param.q ;
                this.page = 0;
                this.size = 10;
                this.search();
            }
        }, (error) => {
          console.log(error);
        })

    }

    goSearch() {
        this.router.navigate(['./search'], {relativeTo: this.route.parent, queryParams: {q: this.query}})
    }
    search() {
        if(this.query.length > 0 && this.page >= 0 && this.size >= 0){
            this.stat = 'searching';
            this.results = null;
            this.ss.search(this.query, this.page, this.size).subscribe((ret) => {
              this.results = ret.data;
              this.stat = 'finish';
              console.log(this.results)
            })
        }
    }
    searchFromPage(idx: number){
        this.page = idx - 1;
        this.search()
    }
    goTermPage(term) {
        this.router.navigateByUrl(`/dictionary/${term}`)
    }
}
