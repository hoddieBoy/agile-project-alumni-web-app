import React from 'react';
import {Button, Result} from 'antd';
import {isRouteErrorResponse, useNavigate, useRouteError} from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    // Check if the error is a RouteErrorResponse and has a status property
    if (!isRouteErrorResponse(error)) {
        return null;
    }

    const handleBackHome = () => navigate('/');
    const handleLogin = () => navigate('/login');
    const handleGoBack = () => navigate(-1);

    switch (error.status) {
        case 404:
            return (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={handleBackHome}>Back Home</Button>}
                />
            );
        case 403:
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" onClick={handleGoBack}>Go Back</Button>}
                />
            );
        default:
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong."
                    extra={<Button type="primary" onClick={handleGoBack}>Go Back</Button>}
                />
            );
    }
};

export default ErrorPage;