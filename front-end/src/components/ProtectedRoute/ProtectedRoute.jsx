import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Function to get user role from localStorage
const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('account'));
    if (user && user.RoleID) {
        return parseInt(user.RoleID, 10);
    }
    return null; // or a default role if necessary
};

// Define fallback paths based on roles
const roleFallbackPaths = {
    1: '/',
    2: '/doctor', // Role 2 fallback path
    3: '/ClinicOwner', // Role 3 fallback path
    4: '/admin',
    // Add other roles and their fallback paths as needed
};

const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = getUserRole();
    console.log(userRole);

    if (!userRole || !allowedRoles.includes(userRole)) {
        const fallbackPath = roleFallbackPaths[userRole] || '/';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};


export default ProtectedRoute;

