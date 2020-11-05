import { AdminDashboard, AdminUsers } from './admin';
import { Category, CategoryDetail } from './category';
import { User, UserDetail } from './user';


export interface CatAPIResponse {
    data?:  Category | CategoryDetail ;
    datas? : Array<Category> | Array<CategoryDetail>;
    message: string | undefined;
}
export interface UserAPIResponse {
    data?: User | UserDetail;
    datas?: Array<User> ;
    message: string | undefined;
}
export interface AdminDashboardAPIResponse {
    data : AdminDashboard;
    message: string | undefined;
}
export interface AdminUsersAPIDResponse {
    data : AdminUsers;
    message : string | undefined;
}

export interface ExtednAPIResponse {
    datas?: Array<string> | Array<any>;
    message : string | undefined;
}