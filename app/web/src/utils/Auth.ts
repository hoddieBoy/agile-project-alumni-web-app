import {getAccessToken, getRefreshToken, refreshAccessToken} from 'utils/Token';
import axiosConfig from "../config/axiosConfig";

/**
 * Checks if a user is currently authenticated synchronously by verifying the access token.
 * This check is immediate and does not attempt to refresh the token.
 * @returns true if the user has a valid access token, false otherwise.
 */
export const isAuthenticatedSync = (): boolean => {
    const accessToken = getAccessToken();
    return !!accessToken;
};

/**
 * Attempts to authenticate the user asynchronously by checking the access token
 * and, if necessary, refreshing it using the refresh token.
 * @returns A promise that resolves to true if the user is authenticated, false otherwise.
 */
export const isAuthenticatedAsync = async (): Promise<boolean> => {
    let accessToken = getAccessToken();
    if (!accessToken) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                const accessToken = await refreshAccessToken(refreshToken);
                return !!accessToken;
            } catch {
                return false;
            }
        }
        return false;
    }
    return true;
};

/**
 * Logs the user out by deleting the authentication cookies and reloading the page.
 */
export const logout = (): void => {
    axiosConfig.post('/auth/logout').then();
};