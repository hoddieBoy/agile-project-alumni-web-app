export default interface AuthenticateResponse {
    user_id: string;
    username: string;
    roles: string[];
    access_token: string;
    refresh_token: string;
    token_type: string;
}
