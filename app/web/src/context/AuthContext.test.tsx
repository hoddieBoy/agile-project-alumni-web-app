import React, {useContext} from 'react';
import {act, render, waitFor} from '@testing-library/react';
import {AuthContext, AuthProvider} from './AuthContext';
import {isAuthenticatedSync, logout as performLogout} from 'utils/Auth';
import {deleteCookie, setCookie} from 'utils/Cookie';
import {decodeTokenPayload, getAccessToken} from 'utils/Token';

jest.mock('utils/Auth', () => ({
    isAuthenticatedSync: jest.fn(),
    logout: jest.fn(),
}));

jest.mock('utils/Cookie', () => ({
    setCookie: jest.fn(),
    deleteCookie: jest.fn(),
}));

jest.mock('utils/Token', () => ({
    decodeTokenPayload: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    refreshAccessToken: jest.fn(),
}));

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const TestComponent = () => {
        const {isAuthenticated, user, login, logout} = useContext(AuthContext);
        return (
            <div>
                <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
                <div>{user ? user.username : 'No User'}</div>
                <button onClick={() => login('newAccessToken', 'newRefreshToken')}>Login</button>
                <button onClick={logout}>Logout</button>
            </div>
        );
    };

    test('initial state and login/logout functionality', async () => {
        (isAuthenticatedSync as jest.Mock).mockReturnValue(false);
        (getAccessToken as jest.Mock).mockReturnValue(null);

        const {getByText} = render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        expect(getByText('Not Authenticated')).toBeInTheDocument();
        expect(getByText('No User')).toBeInTheDocument();

        (decodeTokenPayload as jest.Mock).mockReturnValue({sub: 'testuser', authorities: ['user']});

        await act(async () => {
            getByText('Login').click();
        });

        await waitFor(() => {
            expect(setCookie).toHaveBeenCalledWith('access_token', 'newAccessToken', expect.any(Date));
            expect(setCookie).toHaveBeenCalledWith('refresh_token', 'newRefreshToken', expect.any(Date));
            expect(getByText('Authenticated')).toBeInTheDocument();
            expect(getByText('testuser')).toBeInTheDocument();
        });

        await act(async () => {
            getByText('Logout').click();
        });

        await waitFor(() => {
            expect(performLogout).toHaveBeenCalled();
            expect(deleteCookie).toHaveBeenCalledWith('access_token');
            expect(deleteCookie).toHaveBeenCalledWith('refresh_token');
            expect(getByText('Not Authenticated')).toBeInTheDocument();
            expect(getByText('No User')).toBeInTheDocument();
        });
    });
});
