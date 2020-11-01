import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUsers } from '../interfaces/admin';
import { AdminService } from '../services/admin.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  constructor(private router: Router) { 
  }

  ngOnInit() {
  }
  
}
