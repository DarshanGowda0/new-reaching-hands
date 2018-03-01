export interface Roles {
    editor?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    roles: Roles;
    checkAdmin: boolean;
    checkEditor: boolean;
}
