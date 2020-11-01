import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatAPIResponse } from '../interfaces/api';
import { CatDetailComponent } from '../category/cat-detail/cat-detail.component';
import { Category, CategoryDetail } from '../interfaces/category';

@Injectable()
export class CategoryService {

    server = environment.host

    constructor(private http: HttpClient) { }

    
    // Category API
    getCategoryList() {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/list`)
    }
    getCategory(cid: string) {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/${cid}`)
    }
    addCategory(form: CategoryDetail) {
        let p = new FormData();
        return this.http.post<CatAPIResponse>(`${this.server}/classes/`, p)
    }
    updateCategory(cid: string, form: CategoryDetail) {
        let p = new FormData();
        return this.http.put<CatAPIResponse>(`${this.server}/classes/${cid}`, p)
    }
    deleteCategory(cid: string) {
        return this.http.delete<CatAPIResponse>(`${this.server}/classes/${cid}`)
    }

    // Seed API
    getAllSeeds(rcat: string) {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/seeds?rcat=${rcat}`)
    }
    getSeeds(cid: string) {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/${cid}/seeds`)
    }
    addSeeds(cid: string, seeds: string) {
        let p = new FormData();
        p.append('seeds', seeds);
        return this.http.post<CatAPIResponse>(`${this.server}/classes/${cid}/seeds`, p)
    }
    deleteSeeds(cid: string, seeds: string) {
        return this.http.delete<CatAPIResponse>(`${this.server}/classes/${cid}/seeds?seeds=${seeds}`)
    }


    // Term API
    getAllTerms(rcat: string) {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/terms?rcat=${rcat}`)
    }
    getTerms(cid: string) {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/${cid}/terms`)
    }
    addTerms(cid: string, terms: string) {
        let p = new FormData();
        p.append('terms', terms);
        return this.http.post<CatAPIResponse>(`${this.server}/classes/${cid}/terms`, p)
    }
    deleteTerms(cid: string, terms: string) {
        return this.http.delete<CatAPIResponse>(`${this.server}/classes/${cid}/terms?terms=${terms}`)
    }


    // Extension API
}
