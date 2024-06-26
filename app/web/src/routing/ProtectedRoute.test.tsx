import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import ProtectedRoute from 'routing/ProtectedRoute';
import {AuthContext} from 'context/AuthContext'; // Adjust the import path as necessary


describe('ProtectedRoute', () => {
    it('renders the outlet when authenticated', () => {
        const mockAuthContext = {
            isAuthenticated: true,
            login: jest.fn(),
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route element={<ProtectedRoute element={<div>Protected Content</div>}/>}>
                            <Route path="/" element={<div>Protected Content</div>}/>
                        </Route>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        const mockAuthContext = {
            isAuthenticated: false,
            login: jest.fn(),
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute element={<div>Protected Content</div>}/>}>
                            <Route path="protected" element={<div>Protected Content</div>}/>
                        </Route>
                        <Route path="/login" element={<div>Login Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Assert that we are redirected to the login page
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});