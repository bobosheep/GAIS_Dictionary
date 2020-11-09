export interface User {
    uid: string;
    username: string;
    display_name: string;
    password?: string;
    level: number;
    email: string;
    avatar?: string;
}
export interface UserDetail {
    uid: string;
    username: string;
    display_name: string;
    email: string;
    avatar?: string;
    is_activated?: boolean;
    register_date?: Date;
    last_login?: Date;
    level: number;
    prefer?: any;
}