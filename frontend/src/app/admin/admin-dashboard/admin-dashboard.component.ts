import { Component, OnInit } from "@angular/core";
import { UsersStatistic } from 'src/app/interfaces/admin';
import { AdminService } from 'src/app/services/admin.service';

@Component({
    selector: 'app-admin-dashoboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    userStat: UsersStatistic;

    constructor(private as: AdminService) {

    }

    ngOnInit(){
        this.as.getDashboard().subscribe((ret) => {
          this.userStat = ret.data.user
          console.log(this.userStat)
        })
        
    }
}