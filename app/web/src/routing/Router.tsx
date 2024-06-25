import React from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import LoginLoader from 'pages/login/Login.loader';
import Login from 'pages/login/Login';
import Search from 'pages/search/Search';
import SearchAction from 'pages/search/Search.action';
import ProtectedRoute from 'routing/ProtectedRoute';
import UserManagement from 'pages/user-management/UserManagement';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute element={<Outlet/>}/>,
        children: [
            {
                path: 'search',
                element: <Search/>,
                action: SearchAction,
            },
            {
                path: 'gestion-utilisateurs',
                element: <UserManagement/>
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