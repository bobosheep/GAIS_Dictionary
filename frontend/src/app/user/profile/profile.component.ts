import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: UserDetail;

  constructor(public auth: AuthService, private userService: UserService) {
    
  }

  ngOnInit() {
    const user = this.auth.user
    this.user = user
    // this.userService.getUserDetail(user.uid).subscribe((ret) => {
    //   this.user = ret.data
    // })

  }


}
