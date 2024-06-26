import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from 'context/AuthContext'; // Adjust the import path as necessary

interface ProtectedRouteProps {
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    const {isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <>{element}</> : null;
};

export default ProtectedRoute;