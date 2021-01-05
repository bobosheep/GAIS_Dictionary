import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TermAPIResponse } from '../interfaces/api';
import { Term, TermDetail } from '../interfaces/term';

@Injectable()
export class TermService {

    server = environment.host

    constructor(private http: HttpClient) { }
    
    // Term API
    getTermStat() {
        return this.http.get<{data: any, message: string}>(`${this.server}/terms/stat`)
    }
    getTermList(wlen: number, size: number) {
        return this.http.get<TermAPIResponse>(`${this.server}/terms/?wlen=${wlen}&size=${size}`)
    }
    getTerm(tname: string) {
        return this.http.get<TermAPIResponse>(`${this.server}/terms/${tname}`)
    }
    addTerm(tname: string, freq: number) {
        let p = new FormData()
        p.append('tname', tname)
        p.append('freq', freq.toString())
        return this.http.post<TermAPIResponse>(`${this.server}/terms/`, p)
    }
    updateTerm(term: TermDetail) {
        let tname = term.tname
        let p = new FormData()
        p.append('pos', term.pos.toString())
        p.append('chuyin',  term.chuyin.toString())
        p.append('frequency', term.frequency.toString())
        p.append('aliases', term.aliases.toString())
        p.append('related_synonym', term.related_synonym.toString())
        p.append('synonym', term.synonym.toString())
        p.append('antonym', term.antonym.toString())
        p.append('meaning', term.meaning)
        return this.http.put<TermAPIResponse>(`${this.server}/terms/${tname}`, p)
    }
    deleteTerm(tname: string) {
        return this.http.delete<TermAPIResponse>(`${this.server}/term/${tname}`)
    }
}
