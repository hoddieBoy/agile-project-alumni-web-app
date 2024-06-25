import {getAccessToken, getRefreshToken} from "./Token";
import axiosConfig from "config/axiosConfig";
import {deleteCookie, setCookie} from "./Cookie";

/**
 * Checks if a user is authenticated by verifying the access token.
 * If the access token is invalid, attempts to refresh it using a refresh token.
 * @returns true if the user is authenticated, false otherwise.
 */
export const isAuthenticated = (): boolean => {
    // Check if access token is available
    if (getAccessToken()) {
        return true;
    }

    // Use the refresh token to get a new access token if the refresh token is present
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        axiosConfig.post('/auth/refresh-token', {refreshToken})
            .then((response) => {
                setCookie('access_token', response.data.access_token, new Date(60 * 60 * 1000));
            })
            .catch(() => {
                deleteCookie('refresh_token');
            });
    }

    return !!getAccessToken(); // Return true if a new access token was successfully obtained
}

/**
 * Deletes the user's authentication cookies and reloads the current webpage to effectively log the user out.
 */
export const logout = (): void => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    window.location.reload();
}