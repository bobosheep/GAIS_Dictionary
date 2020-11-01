import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminDashboardAPIResponse, UserAPIResponse, AdminUsersAPIDResponse } from '../interfaces/api';

@Injectable()
export class AdminService {

    server = environment.host

    constructor(private http: HttpClient) { }

    getDashboard() {
        return this.http.get<AdminDashboardAPIResponse>(`${this.server}/admin/`)
    }
    getAllUsers() {
        return this.http.get<AdminUsersAPIDResponse>(`${this.server}/admin/users`)
    }
    getUser(id: string) {
        return this.http.get<UserAPIResponse>(`${this.server}/admin/users/${id}`)
    }
}
