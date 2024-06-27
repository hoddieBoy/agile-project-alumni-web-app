import {getCookie} from 'utils/Cookie';
import AuthenticateResponse from "../payload/response/AuthenticateResponse";
import axiosConfig from "../config/axiosConfig";

export function decodeTokenPayload(token: string): Record<string, any> | null {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Failed to decode token payload:', error);
        return null;
    }
}

export function isTokenValid(token: string): boolean {
    const parsedPayload = decodeTokenPayload(token);
    if (!parsedPayload || typeof parsedPayload.exp !== 'number') {
        return false;
    }
    const expiration = parsedPayload.exp;
    const now = Date.now() / 1000;
    return now < expiration;
}

export function getAccessToken(): string {
    const accessToken = getCookie('access_token');
    if (accessToken && isTokenValid(accessToken)) {
        return accessToken;
    }
    return '';
}

export function getRefreshToken(): string {
    const refreshToken = getCookie('refresh_token');

    return refreshToken || '';
}

export function refreshAccessToken(refreshToken: string): Promise<string> {
    return axiosConfig.post<AuthenticateResponse>('/auth/refresh-token', {refreshToken})
        .then((response) => {
            const {access_token} = response.data;
            return access_token;
        })
        .catch((error) => {
            console.error('Failed to refresh token:', error);
            throw error;
        });
}