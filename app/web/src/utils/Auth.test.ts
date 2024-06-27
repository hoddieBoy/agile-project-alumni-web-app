import {getAccessToken, getRefreshToken, refreshAccessToken} from 'utils/Token';
import axiosConfig from 'config/axiosConfig';
import {isAuthenticatedAsync, isAuthenticatedSync, logout} from 'utils/Auth';

// Mock dependencies
jest.mock('utils/Token', () => ({
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    refreshAccessToken: jest.fn(),
}));

jest.mock('config/axiosConfig', () => ({
    post: jest.fn(),
}));

jest.mock('utils/Cookie', () => ({
    deleteCookie: jest.fn(),
}));

describe('Authentication utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isAuthenticatedSync', () => {
        it('returns true if access token is present', () => {
            (getAccessToken as jest.Mock).mockReturnValue('valid_access_token');
            expect(isAuthenticatedSync()).toBe(true);
        });

        it('returns false if access token is not present', () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            expect(isAuthenticatedSync()).toBe(false);
        });
    });

    describe('isAuthenticatedAsync', () => {
        it('returns true if access token is present', async () => {
            (getAccessToken as jest.Mock).mockReturnValue('valid_access_token');
            await expect(isAuthenticatedAsync()).resolves.toBe(true);
        });

        it('attempts to refresh token if access token is not present but refresh token is', async () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue('valid_refresh_token');
            (refreshAccessToken as jest.Mock).mockResolvedValue('new_access_token');

            await expect(isAuthenticatedAsync()).resolves.toBe(true);

            // Ensure refreshAccessToken is called for refreshing token
            expect(refreshAccessToken).toHaveBeenCalledWith('valid_refresh_token');
        });

        it('returns false if refreshing token fails', async () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue('invalid_refresh_token');
            (refreshAccessToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

            await expect(isAuthenticatedAsync()).resolves.toBe(false);
        });

        it('returns false if neither access token nor refresh token are present', async () => {
            (getAccessToken as jest.Mock).mockReturnValue(null);
            (getRefreshToken as jest.Mock).mockReturnValue(null);

            await expect(isAuthenticatedAsync()).resolves.toBe(false);
        });
    });

    describe('logout', () => {
        it('posts to /auth/logout', async () => {
            const postMock = axiosConfig.post as jest.MockedFunction<typeof axiosConfig.post>;
            postMock.mockResolvedValue({});

            logout();

            expect(postMock).toHaveBeenCalledWith('/auth/logout');
        });
    });
});
