export interface User {
    uid: string;
    email: string;
    checkAdmin?: boolean;
    checkEditor?: boolean;
    fcmTokens?: { [token: string]: true };
}
