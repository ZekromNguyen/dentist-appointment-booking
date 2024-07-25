import HeaderAdmin from '../../componentsAdmin/HeaderAdmin/HeaderAdmin';
import HomeAdmin from '../../componentsAdmin/HomeAdmin/HomeAdmin';
import Sidebar from '../../componentsAdmin/Sidebar/Sidebar';
import { useState } from 'react';
import './admin.scss';
import React from 'react';

export default function Admin() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [account, setAccount] = useState(null); // Add account state

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    }

    console.log("Passing setAccount to Sidebar:", setAccount);

    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} setAccount={setAccount} />
                <div className='img-admin'></div>
            </div>
        </div>
    );
}
