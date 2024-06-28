import React, { useState } from 'react';
import HeaderAdmin from '../HeaderAdmin/HeaderAdmin';
import Sidebar from '../Sidebar/Sidebar';
import Manage from '../Mange/Manage'; // Import the actual ManageAccount component

export default function ManageAccount() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Manage />
            </div>
        </div>
    )
}
