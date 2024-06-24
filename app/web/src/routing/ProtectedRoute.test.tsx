import React from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
    it('renders the outlet when authenticated', () => {
        const {getByText} = render(
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute isAuthenticated={true}/>}>
                        <Route path="/" element={<div>Protected Content</div>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        );

        expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        const {container} = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProtectedRoute isAuthenticated={false}/>}>
                        <Route path="protected" element={<div>Protected Content</div>}/>
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>}/>
                </Routes>
            </BrowserRouter>
        );

        expect(container.innerHTML).toMatch('Login Page');
    });
});