import React from 'react';
import {createBrowserRouter, Navigate} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import {getAccessToken} from "utils/Token";
import ErrorPage from "components/pages/ErrorPage";
import {action as LoginAction} from "components/pages/login/Login.action";
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
                            element: <Navigate to={'/search'} />
                        },
                        {
                            path: '/search',
                            element: <div>Welcome to the search page</div>
                        }
                    ]
                },
                {
                    path: '/login',
                    element: isAuthenticated() ? <Navigate to={'/'} /> : <Login />,
                    action: LoginAction
                }
            ]
        }
    ]
);

export default router;