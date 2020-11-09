import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UserAPIResponse } from '../interfaces/api';

@Injectable()
export class UserService {

  server = environment.host

  constructor(private http: HttpClient, private route: Router) { 
  }

  getUserDetail(uid: string) {
    return this.http.get<UserAPIResponse>(`${this.server}/user/${uid}`)
  }

}
