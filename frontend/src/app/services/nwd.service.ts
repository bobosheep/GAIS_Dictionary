import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NWDAPIResponse } from '../interfaces/api';

@Injectable()
export class NWDService {

    server = environment.host

    constructor(private http: HttpClient) { }
    
    getCandidateList(){
        return this.http.get<NWDAPIResponse>(`${this.server}/api/nwd/stat/0`)
    }
    getNewWordList(page: number, size: number){
        return this.http.get<NWDAPIResponse>(`${this.server}/api/nwd/stat/1?page=${page}&size=${size}`)
    }
    getRejectList(page: number, size: number){
        return this.http.get<NWDAPIResponse>(`${this.server}/api/nwd/stat/2?page=${page}&size=${size}`)
    }
    checkCandidate(term, stat){
        if (stat){
            let p = new FormData();
            p.append('tname', term)
            return this.http.post<NWDAPIResponse>(`${this.server}/api/nwd/stat/0`, p)
        } else {
            return this.http.delete<NWDAPIResponse>(`${this.server}/api/nwd/stat/0?tname=${term}`)
        }
    }
    uploadFile(file: any){
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<NWDAPIResponse>(`${this.server}/api/nwd/upload`, formData)
    }
}
