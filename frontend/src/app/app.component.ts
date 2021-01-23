import { Component } from '@angular/core';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GaisDictionary';
  user : User;
  constructor(private auth: AuthService) {
    this.auth.currentUser.subscribe(x => {
      this.user = x
    })
  }


  logout() {
    this.auth.logout();
  }
}
