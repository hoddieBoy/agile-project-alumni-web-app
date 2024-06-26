import {getCookie} from './Cookie';

/**
 * Decodes the payload of a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Record<string, any> | null} The parsed payload of the token, or null if decoding fails.
 */
function decodeTokenPayload(token: string): Record<string, any> | null {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Failed to decode token payload:', error);
        return null;
    }
}

/**
 * Checks if the given token is valid based on its expiration time.
 * @param {string} token - The JWT token.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
export function isTokenValid(token: string): boolean {
    const parsedPayload = decodeTokenPayload(token);
    if (!parsedPayload || typeof parsedPayload.exp !== 'number') {
        return false;
    }
    const expiration = parsedPayload.exp;
    const now = Date.now() / 1000;
    return now < expiration;
}

/**
 * Retrieves the access token from the cookie if it is valid.
 * @returns {string} The access token if valid, or an empty string if not.
 */
export function getAccessToken(): string {
    // Get the access token from the cookie named 'access_token'.
    const accessToken = getCookie('access_token');
    if (accessToken && isTokenValid(accessToken)) {
        return accessToken;
    }
    return '';
}

export function getRefreshToken(): string {
    // Get the refresh token from the cookie named 'refresh_token'.
    const refreshToken = getCookie('refresh_token');
    if (refreshToken && isTokenValid(refreshToken)) {
        return refreshToken;
    }
    return '';
}