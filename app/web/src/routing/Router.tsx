import React from 'react';
import {createBrowserRouter, redirect} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import LoginLoader from 'pages/login/Login.loader';
import Login from 'pages/login/Login';
import Search from 'pages/search/Search';
import SearchAction from 'pages/search/Search.action';
import {isAuthenticated} from "utils/Auth";

import Stat from 'pages/stat/Stat'
import {deleteCookie} from "utils/Cookie";

// Function to check if the user is authenticated


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
                        element: <Search/>,
                        action: SearchAction,
                        
                    },
                    {
                        // Search page route
                        path: '/stat',
                        element: <Stat/>,
                        
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