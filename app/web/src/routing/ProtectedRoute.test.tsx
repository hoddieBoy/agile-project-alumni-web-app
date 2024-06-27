import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import ProtectedRoute from 'routing/ProtectedRoute';
import {AuthContext} from 'context/AuthContext';

describe('ProtectedRoute', () => {
    it('renders the element when authenticated', () => {
        const mockAuthContext = {
            isAuthenticated: true,
            user: {username: 'testuser', roles: ['user']}, // Include the user info for completeness
            login: jest.fn(),
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute element={<div>Protected Content</div>}/>}/>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        const mockAuthContext = {
            isAuthenticated: false,
            user: {username: '', roles: []}, // Empty user state for unauthenticated context
            login: jest.fn(),
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route path="/protected" element={<ProtectedRoute element={<div>Protected Content</div>}/>}/>
                        <Route path="/login" element={<div>Login Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Assert that we are redirected to the login page
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders null when not authenticated and no redirect path is provided', () => {
        const mockAuthContext = {
            isAuthenticated: false,
            user: {username: '', roles: []},
            login: jest.fn(),
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute element={<div>Protected Content</div>}/>}/>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Assert that the protected content is not rendered
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
});