import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminDashboardAPIResponse, UserAPIResponse, AdminUsersAPIDResponse } from '../interfaces/api';
import { AuthService } from './auth.service';

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

@Injectable()
export class CanActivateAdmin implements CanActivate {
  constructor(private as: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    this.as.checkCurrentUser()
    return this.as.user && this.as.user.level == 0;
  }
}