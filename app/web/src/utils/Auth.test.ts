import {getAccessToken, getRefreshToken} from 'utils/Token';
import axiosConfig from 'config/axiosConfig';
import {deleteCookie, setCookie} from 'utils/Cookie';
import {isAuthenticated, logout} from 'utils/Auth';
import {waitFor} from '@testing-library/react';

// Mock dependencies
jest.mock('utils/Token', () => ({
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
}));

jest.mock('config/axiosConfig', () => ({
    post: jest.fn(),
}));

jest.mock('utils/Cookie', () => ({
    deleteCookie: jest.fn(),
    setCookie: jest.fn(),
}));

describe('Authentication utilities', () => {
    describe('isAuthenticated', () => {
        it('returns true if access token is present', () => {
            (getAccessToken as jest.Mock).mockReturnValue('valid_access_token');
            expect(isAuthenticated()).toBe(true);
        });

        it('attempts to refresh token if access token is not present but refresh token is', async () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue('valid_refresh_token');
            (axiosConfig.post as jest.Mock).mockResolvedValue({data: {access_token: 'new_access_token'}});

            isAuthenticated();

            // Ensure axios.post is called for refreshing token
            expect(axiosConfig.post).toHaveBeenCalledWith('/auth/refresh-token', {refreshToken: 'valid_refresh_token'});

            // Use waitFor to handle async update of access token
            await waitFor(() => {
                expect(setCookie).toHaveBeenCalledWith('access_token', 'new_access_token', new Date(60 * 60 * 1000));
            });

            // Since this is a synchronous function, we need to recheck token after promise resolution
            (getAccessToken as jest.Mock).mockReturnValue('new_access_token');
            expect(isAuthenticated()).toBe(true);
        });

        it('deletes refresh token cookie if refreshing fails', async () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue('invalid_refresh_token');
            (axiosConfig.post as jest.Mock).mockRejectedValue(new Error('Invalid token'));

            isAuthenticated();

            // Use waitFor to handle async error handling
            await waitFor(() => {
                expect(deleteCookie).toHaveBeenCalledWith('refresh_token');
            });
        });

        it('returns false if neither access token nor refresh token are present', () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue(null);
            expect(isAuthenticated()).toBe(false);
        });
    });

    describe('logout', () => {
        it('deletes cookies and reloads the page', () => {
            logout();

            expect(deleteCookie).toHaveBeenCalledWith('access_token');
            expect(deleteCookie).toHaveBeenCalledWith('refresh_token');
        });
    });
});