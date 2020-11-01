import { Category } from './category';
import { User, UserDetail } from './user';

export interface Action {
    id ?: string;
    level ?: number;
    action ?: string;
    action_time ?: Date;
    action_date ?: Date;
    action_part ?: Category;
    action_description ?: string;
    action_stat ?: boolean;
    user ?: User;
    user_ip ?: string;
}
export interface UsersStatistic {
    total_users ?: number;
    activated_users ?: number;
    new_users ?: number;
    editor_users ?: number;
    admins ?: number;
    week_edit ?: number;
    month_edit ?: number;
}
export interface AdminUsers {
    stat ?: UsersStatistic;
    users ?: Array<UserDetail>;
    actions ?: Array<Action>;
}
export interface AdminDashboard {
    user ?: UsersStatistic;
    category ?: any;
    term ?: any;
    report ?: any;
}