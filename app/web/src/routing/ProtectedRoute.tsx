import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from "prop-types";

function ProtectedRoute({ isAuthenticated } : { isAuthenticated: boolean }) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

export default ProtectedRoute;