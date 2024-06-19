import {getCookie} from "./Cookie";

export function isTokenValid(token: string): boolean {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    const expiration = parsedPayload.exp;
    const now = Date.now() / 1000;
    return now < expiration;
}

export function getAccessToken(): string {
    // Get the access token from the cookie named 'access_token' after checking if it is valid or not.
    const accessToken = getCookie('access_token');
    if (accessToken && isTokenValid(accessToken)) {
        return accessToken;
    }

    return '';
}


