import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import { User, UserDetail } from '../interfaces/user'
import { Router } from '@angular/router';
import { UserAPIResponse } from '../interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  server = environment.host
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private route: Router) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('current_user')))
    console.log(this.currentUserSubject.value)
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get user() {
    return this.currentUserSubject.value
  }

  checkCurrentUser() {
    this.http.get(`${this.server}/auth/curuser`).subscribe((ret) => {
      const userInfo = { ...this.user, ...ret['data']}
      localStorage.setItem('current_user', JSON.stringify(ret['data']));
      this.currentUserSubject.next(ret['data'])
    }, (error) => {
      localStorage.clear()
      this.currentUserSubject.next(null)
    })
  }
  

  login(username: string, password: string) {
    let p = new FormData()
    p.append('username', username)
    p.append('password', password)
    return this.http.post<UserAPIResponse>(`${this.server}/auth/login`, p).pipe(map((ret) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('current_user', JSON.stringify(ret['data']));
      this.currentUserSubject.next(ret['data'])
      return ret;
    }))
  }
  register(registerForm: UserDetail) {
    let p = new FormData()
    Object.keys(registerForm).forEach((key) => {
        p.append(key, registerForm[key])
    })
    return this.http.post<UserAPIResponse>(`${this.server}/auth/register`, p)
  }

  logout() {
    let p = new FormData()
    localStorage.removeItem('current_user')
    this.currentUserSubject.next(null)
    this.http.post(`${this.server}/auth/logout`, p).subscribe()
    this.route.navigateByUrl('/');
  }
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
      req = req.clone({
        withCredentials: true
      });
      return next.handle(req).pipe(
          map(event => {
              if (event instanceof HttpResponse) {
                  event = event.clone({
                      headers: event.headers.set('Set-Cookie', 'session_token')
                  });
              }

              return event;
          })
      )
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
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];


