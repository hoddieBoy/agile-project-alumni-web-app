import React from 'react';
import {createBrowserRouter, redirect} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import {getAccessToken} from 'utils/Token';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import LoginLoader from 'pages/login/Login.loader';
import Login from 'pages/login/Login';

// Function to check if the user is authenticated
export const isAuthenticated = (): boolean => !!getAccessToken();

const router = createBrowserRouter([
    {
        // Error page for unmatched routes or errors
        errorElement: <ErrorPage/>,
        children: [
            {
                // Protected routes
                element: <ProtectedRoute isAuthenticated={isAuthenticated()}/>,
                children: [
                    {
                        // Default route redirects to /search
                        path: '/',
                        loader: () => redirect('/search')
                    },
                    {
                        // Search page route
                        path: '/search',
                        element: <div>Welcome to the search page</div>
                    }
                ]
            },
            {
                // Login route
                path: '/login',
                element: <Login/>,
                action: LoginAction,
                loader: LoginLoader
            }
        ]
    }
]);

export default router;