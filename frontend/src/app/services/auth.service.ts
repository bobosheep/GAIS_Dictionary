import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get user() {
    return this.currentUserSubject.value
  }

  checkCurrentUser() {
    return this.http.get(`${this.server}/auth/curuser`).pipe(map((ret) => {
      const userInfo = { ...this.user, ...ret['data']}
      localStorage.setItem('current_user', JSON.stringify(ret['data']));
      this.currentUserSubject.next(ret['data'])
      return ret
    })).pipe(catchError((error) => {
      console.warn(error)
      localStorage.removeItem('current_user')
      this.currentUserSubject.next(null)
      return throwError(error);

    }))
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
    console.log('hello')
    const check = new Observable<boolean>((observer) => {
      let watchId: number;

      
      this.as.checkCurrentUser().subscribe(
        (ret) => {}, 
        (error) => {
          if (error.status === 401 || error.status === 404) {
            this.message.create('error', '尚未登入或是 Token 已經失效，請<strong>重新登入</strong>')
            observer.next(false);
          } else {
            this.message.create('error', '有 BUG ?!')
            this.message.create('error', error.error.message)
            observer.next(false);
          }
        },
        () => {
          if(this.as.user && this.as.user.level <= 1) {
            observer.next(true);
          } else {
            this.message.create('error', '權限不足，請向管理員<strong>申請為編輯人員</strong>。')
            observer.next(false);
          }
          console.log('done');
      })

      return {
        unsubscribe() {
          navigator.geolocation.clearWatch(watchId);
        }
      }
    })
    return check
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];


