import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatAPIResponse, ExtendAPIResponse } from '../interfaces/api';
import { CatDetailComponent } from '../category/cat-detail/cat-detail.component';
import { Category, CategoryDetail } from '../interfaces/category';
import { ExtensionParams, similarWordParams } from '../interfaces/extension';
import { AuthService } from './auth.service';

@Injectable()
export class CategoryService {

    server = environment.host

    constructor(private http: HttpClient) { }

    
    // Category API
    downloadCategoryDictionary(cats: Array<string>, downloadType: string = 'file') {
        let part = cats.join(',');
        let headers;
        console.log(part);
        headers = new Headers({
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return this.http.get(`${this.server}/classes/download?cats=${part}&type=${downloadType}`, {headers, responseType: 'blob'})
    }
    getCategoryList() {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/list`)
    }
    getCategoryStat() {
        return this.http.get<CatAPIResponse>(`${this.server}/classes/stat`)
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
    extendAllCategory(params: ExtensionParams){
        let p = new FormData();
        Object.keys(params).forEach((key) => {
            p.append(key, params[key])
        })
        return this.http.post<ExtendAPIResponse>(`${this.server}/extension/`, p)
    }
    extendCategory(cid: string, params: ExtensionParams){
        let p = new FormData();
        Object.keys(params).forEach((key) => {
            p.append(key, params[key])
        })
        return this.http.post<ExtendAPIResponse>(`${this.server}/extension/${cid}`, p)
    }
    extendTerm(params: similarWordParams){
        let args = ''
        let is_first = true
        Object.keys(params).forEach((key) => {
            if (!is_first) {
                args += '&';
            }
            is_first = false
            args += `${key}=${params[key]}`
        })
        return this.http.get<ExtendAPIResponse>(`${this.server}/extension/term?${args}`)
    }
}
