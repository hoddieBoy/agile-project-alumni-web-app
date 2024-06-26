import React, {useContext} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AuthContext, AuthProvider} from './AuthContext';

// A simple component to test the AuthContext
const TestComponent: React.FC = () => {
    const {isAuthenticated, login, logout} = useContext(AuthContext);

    return (
        <div>
            <span data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
            <button onClick={login} data-testid="login-button">Login</button>
            <button onClick={logout} data-testid="logout-button">Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('provides default value correctly', () => {
        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    it('updates the authentication state on login', () => {
        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        userEvent.click(screen.getByTestId('login-button'));
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    it('updates the authentication state on logout', () => {
        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        // First login
        userEvent.click(screen.getByTestId('login-button'));
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

        // Then logout
        userEvent.click(screen.getByTestId('logout-button'));
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
});