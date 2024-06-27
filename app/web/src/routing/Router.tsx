import React from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import Login from 'pages/login/Login';
import Search from 'pages/search/Search';
import SearchAction from 'pages/search/Search.action';
import ProtectedRoute from './ProtectedRoute';
import Stat from 'pages/stat/Stat'
import AlumniImportExport from 'pages/impExp/ImpExp';
import UserManagementPage from "pages/user-management/UserManagement";
import UserManagementLoader from "pages/user-management/UserManagement.loader";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
        action: LoginAction,
        errorElement: <ErrorPage/>
    },
    {
        path: '/',
        element: <ProtectedRoute element={<Outlet/>}/>,
        children: [
            {
                path: '/search',
                element: <Search/>,
                action: SearchAction,
            },
            {
                // Search page route
                path: '/stat',
                element: <Stat/>,
            },
            {
                // Search page route
                path: '/import-export',
                element: <AlumniImportExport/>,
            },
            {
                // User management page route
                path: '/gestion-utilisateurs',
                element: <UserManagementPage/>,
                loader: UserManagementLoader,
            },
        ],
        errorElement: <ErrorPage/>
    },
]);

export default router;