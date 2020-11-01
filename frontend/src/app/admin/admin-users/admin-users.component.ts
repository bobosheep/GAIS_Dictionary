import { Component, Input, OnInit } from "@angular/core";
import { Action, AdminUsers, UsersStatistic } from 'src/app/interfaces/admin';
import { UserDetail } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

    result: AdminUsers;
    statistic: UsersStatistic;
    selectedPage: number = 0;

    details: string[] = ['Users', 'Activities', 'Reports'];
    detailIcons: string[] = ['user', 'rocket', 'bug']

    constructor(private as: AdminService) {

    }

    ngOnInit(){
        this.as.getAllUsers().subscribe((ret) => {
            this.result = ret.data
            this.statistic = this.result.stat
            this.result.users.forEach(u => u.register_date)
            console.log(this.result.users)
        })
    }

    selectPart(idx: number) {
        this.selectedPage = idx;
    }
}

@Component({
    selector: 'app-admin-users-table',
    template: `
    <nz-table #userTable [nzData]="showData" >
        <thead (nzSortChange)="sort($event)" nzSingleSort>
          <tr>
            <th
                nzShowSort
                nzSortKey="uname"
            >
                Name
            </th>
            <th
                nzShowSort
                nzSortKey="display_name"
            >
                Display Name
            </th>
            <th
                nzShowSort
                nzSortKey="email"
            >
                Email
            </th>
            <th>Level</th>
            <th>Activated</th>
            <th
                nzShowSort
                nzSortKey="last_login"
            >
                Last Login
            </th>
            <th
                nzShowSort
                nzSortKey="register_date"
            >
                Register Time
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of userTable.data">
            
            <td>{{ data.uname }}</td>
            <td>{{ data.display_name }}</td>
            <td>{{ data.email }}</td>
            <td>{{ data.level }}</td>
            <td>
                <ng-container *ngIf="data.activated; else notActivated">
                    <i nz-icon nzType="check" nzTheme="outline" style="color: #52c41a;"></i>
                </ng-container>
                <ng-template #notActivated>
                    <i nz-icon nzType="close" nzTheme="outline" style="color: #ff6347;"></i>

                </ng-template>
            </td>
            <td>{{ data.last_login }}</td>
            <td>{{ data.register_date | date }}</td>
            <td>
              <a>Edit</a>
              <a>Delete</a>
            </td>
          </tr>
        </tbody>

    </nz-table>`,
    styles: [``]
})
export class AdminUsersTableComponent implements OnInit{
    sortName: string | null = null;
    sortValue: string | null = null;
    searchActivated : string[] = [];
    searchLevel : string[] = [];

    @Input() tableData: Array<UserDetail>;
    showData : Array<UserDetail>;
    constructor(){

    }
    ngOnInit () {
        this.showData = [...this.tableData];
        console.log('Init', this.showData)
    }

    sort(sort: { key: string; value: string }): void {
      this.sortName = sort.key;
      this.sortValue = sort.value;
      this.show();
    }
    filter(searchLevel, searchActivated) {

    }
    show() {
        const data = this.tableData;
        /** sort data **/
        console.log('sort', this.sortName, this.sortValue)
        if (this.sortName && this.sortValue) {
            this.showData = [ ...data.sort((a, b) => {
                return this.sortValue === 'ascend'
                ? a[this.sortName!] > b[this.sortName!]
                    ? 1
                    : -1
                : b[this.sortName!] > a[this.sortName!]
                ? 1
                : -1
            })];
            console.log('sorted', this.showData)
        } else {
          this.showData = data;
        }

    }
}