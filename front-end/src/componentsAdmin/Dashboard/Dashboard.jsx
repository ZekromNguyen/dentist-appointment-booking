import React, { useState } from 'react';
import HeaderAdmin from '../../componentsAdmin/HeaderAdmin/HeaderAdmin';
import HomeAdmin from '../../componentsAdmin/HomeAdmin/HomeAdmin';
import Sidebar from '../../componentsAdmin/Sidebar/Sidebar';
import './dashboard.scss';

export default function Dashboard() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <HomeAdmin />
            </div>
        </div>
    );
}
