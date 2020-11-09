import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from '../services/user.service';
import { RegisterComponent } from './register/register.component';
import { NzIconModule, NzInputModule, NzMessageModule } from 'ng-zorro-antd';
import { AuthService } from '../services/auth.service';



@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule, 
        NzIconModule,
        NzInputModule,
        NzMessageModule
    ], 
    providers: [UserService, AuthService],
    entryComponents: []
})
export class UserModule {
  constructor() {
  }
}
