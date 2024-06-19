import React  from 'react';
import { Button, Result } from 'antd';
import {useRouteError, isRouteErrorResponse} from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    if (!isRouteErrorResponse(error)) {
        return null;
    }

    if (error.status === 404) {
        return <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">Back Home</Button>}
        />;
    }

    if (error.status === 403) {
        return <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => navigate('/login')}>Login</Button>}
        />;
    }

    return <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>}
    />;
}

export default ErrorPage;
