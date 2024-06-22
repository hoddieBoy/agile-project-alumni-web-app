import React from 'react';
import {createBrowserRouter, redirect} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import {getAccessToken} from "utils/Token";
import ErrorPage from "components/pages/ErrorPage";
import LoginAction from "components/pages/login/Login.action";
import LogingLoader from "components/pages/login/Login.loader";
import Login from "components/pages/login/Login";

export const isAuthenticated = () => !!getAccessToken();

const router = createBrowserRouter(
    [
        {
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
                    children: [
                        {
                            path: '/',
                            loader: () => redirect('/search')
                        },
                        {
                            path: '/search',
                            element: <div>Welcome to the search page</div>
                        }
                    ]
                },
                {
                    path: '/login',
                    element: <Login />,
                    action: LoginAction,
                    loader: LogingLoader
                }
            ]
        }
    ]
);

export default router;