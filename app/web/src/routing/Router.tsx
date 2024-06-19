import React from 'react';
import {createBrowserRouter, Navigate} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import {getAccessToken} from "utils/Token";

export const isAuthenticated = () => {
    console.log(getAccessToken());
    console.log(!!getAccessToken());
    return !!getAccessToken();
}

const router = createBrowserRouter(
    [
        {
            path: '/login',
            element: <div>Welcome to the login page</div>
        },
        {
            element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
            children: [
                {
                    path: '/',
                    element: <Navigate to='/search' />,
                },
                {
                    path: '/search',
                    element: <div>Welcome to the search page</div>
                }
            ]
        }
    ]
);

export default router;