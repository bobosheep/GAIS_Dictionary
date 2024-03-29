import { AdminDashboard, AdminUsers } from './admin';
import { Category, CategoryDetail } from './category';
import { NewWord } from './new_word';
import { Term, TermDetail } from './term';
import { User, UserDetail } from './user';

export interface CatAPIResponse {
    data?:  Category | CategoryDetail | any;
    datas? : Array<Category> | Array<CategoryDetail> | Array<any>;
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

export interface ExtendAPIResponse {
    datas?: Array<string> | Array<any>;
    message : string | undefined;
}

export interface TermAPIResponse {
    data ?: Term | TermDetail;
    datas ?: Array<Term> | Array<TermDetail>;
    message : string | undefined;
}
export interface NWDAPIResponse {
    data ?: NewWord;
    datas ?: Array<NewWord>;
    message : string | undefined;
}