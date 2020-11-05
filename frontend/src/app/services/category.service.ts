import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatAPIResponse, ExtednAPIResponse } from '../interfaces/api';
import { CatDetailComponent } from '../category/cat-detail/cat-detail.component';
import { Category, CategoryDetail } from '../interfaces/category';
import { ExtensionParams, similarWordParams } from '../interfaces/extension';
import { AuthService } from './auth.service';
import { NzMessageService } from 'ng-zorro-antd';

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
    extendAllCategory(params: ExtensionParams){
        let p = new FormData();
        Object.keys(params).forEach((key) => {
            p.append(key, params[key])
        })
        return this.http.post<ExtednAPIResponse>(`${this.server}/extension/`, p)
    }
    extendCategory(cid: string, params: ExtensionParams){
        let p = new FormData();
        Object.keys(params).forEach((key) => {
            p.append(key, params[key])
        })
        return this.http.post<ExtednAPIResponse>(`${this.server}/extension/${cid}`, p)
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
        return this.http.get<ExtednAPIResponse>(`${this.server}/extension/term?${args}`)
    }
}

@Injectable()
export class CanActivateEdition implements CanActivate {
  constructor(private as: AuthService, private message: NzMessageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    this.as.checkCurrentUser()
    if(this.as.user && this.as.user.level <= 1){
        return true;
    } else {
        this.message.create('error', '沒權限進行編輯，請<strong>登入</strong>或是<strong>申請為編輯人員</strong>。')
        return false;
    }
  }
}