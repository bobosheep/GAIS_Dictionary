import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public auth: AuthService, private formBuilder: FormBuilder, 
              private router: Router, private message: NzMessageService) {
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userid: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*/)]],
      password: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9@.,;]*/)]]
    });
  }

  login() {
    console.log('login')
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.controls.userid.value, this.loginForm.controls.password.value).subscribe((res) => {
        this.router.navigate(['/']);
      }, (error) => {
        this.message.error(error.error.message)
      })

    }
  }


}
