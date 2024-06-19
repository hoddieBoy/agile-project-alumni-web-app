import React from 'react';
import {createBrowserRouter, Navigate} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import {getAccessToken} from "utils/Token";
import ErrorPage from "components/pages/ErrorPage";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const isAuthenticated = () => {
    console.log(getAccessToken());
    console.log(!!getAccessToken());
    return !!getAccessToken();
}

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
                    element: <div>Welcome to the login page</div>
                }
            ]
        }
    ]
);

export default router;