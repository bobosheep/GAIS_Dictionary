import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class SearchService {

    server = environment.host

    constructor(private http: HttpClient) { }
    
    // Search Term API
    search(q: string, page: number = 0, size: number = 10) {

        return this.http.get<{data: any, message: string}>(`${this.server}/terms/search?term=${q}&page=${page}&size=${size}`)
    }
}
