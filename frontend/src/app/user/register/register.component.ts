import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor(private auth: AuthService, private formBuilder: FormBuilder, 
              private router: Router, private message: NzMessageService) {
    
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*/)]],
      display_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9@.,;]*/)]],
      passwordValid: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9@.,;]*/)]]
    });
  }
  get username() { return this.registerForm.get('username'); }
  get display_name() { return this.registerForm.get('display_name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get passwordValid() { return this.registerForm.get('passwordValid'); }
  register() {
      if(this.registerForm.valid){
            this.registerForm.removeControl('passwordValid')
            this.auth.register(this.registerForm.value).subscribe((ret) => {
                this.message.success(ret.message)
                this.router.navigateByUrl('/login')
            }, (error) => {
                this.message.error(error.error.message)
            })
      }
  }

}
