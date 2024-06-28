// AdminRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManageAccount from '../componentsAdmin/ManageAccount/ManageAccount';
import Dashboard from '../componentsAdmin/Dashboard/Dashboard';
import Admin from '../pages/Admin/Admin';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={< Admin />} />
            <Route path="manage-account" element={<ManageAccount />} />
            <Route path="dashboard" element={<Dashboard />}></Route>

            {/* Add other routes as needed */}
        </Routes>
    );
}

export default AdminRoutes;
