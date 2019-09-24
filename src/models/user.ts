export type User = {
    id: number;
    email: string;
    username: string;
}

export type UserDetail = {
    id: number;
    date_joined: string;
    email: string;
    first_name: string;
    groups: Group[]
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login?: string;
    last_name: string;
    password: string;
    user_permissions: []
    username: string;
}

export type Group = {

}