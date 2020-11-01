import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  constructor(public auth: AuthService, private formBuilder: FormBuilder, private router: Router) {
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    console.log('login')
    this.auth.login(this.loginForm.controls.userid.value, this.loginForm.controls.password.value).subscribe((res) => {
      console.log(res)
      this.router.navigate(['/']);
    }, (error) => {
      console.log(error)
    })
  }

  register() {
    
  }

}
