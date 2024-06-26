import React from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import ErrorPage from 'pages/ErrorPage';
import LoginAction from 'pages/login/Login.action';
import LoginLoader from 'pages/login/Login.loader';
import Login from 'pages/login/Login';
import Search from 'pages/search/Search';
import SearchAction from 'pages/search/Search.action';
import ProtectedRoute from './ProtectedRoute'; // Adjust the import path as necessary
import Stat from 'pages/stat/Stat'
import AlumniImportExport from 'pages/impExp/ImpExp';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
        loader: LoginLoader,
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
                path: '/import',
                element: <AlumniImportExport/>,

            }
        ],
        errorElement: <ErrorPage/>
    },
]);

export default router;