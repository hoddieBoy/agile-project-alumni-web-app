import React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import LoginLoader from 'pages/login/Login.loader';
import Login from 'pages/login/Login';
import Search from 'pages/search/Search';
import SearchAction from 'pages/search/Search.action';
import ProtectedRoute from './ProtectedRoute'; // Adjust the import path as necessary
import Stat from 'pages/stat/Stat'

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute element={<Search/>}/>,
        children: [
            {
                path: 'search',
                element: <ProtectedRoute element={<Search/>}/>,
                action: SearchAction,
            },
            {
                // Search page route
                path: '/stat',
                element: <Stat/>,

            }
        ],
        errorElement: <ErrorPage/>
    },
    {
        path: '/login',
        element: <Login/>,
        loader: LoginLoader,
        action: LoginAction,
        errorElement: <ErrorPage/>
    },
]);

export default router;