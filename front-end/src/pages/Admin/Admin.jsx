import HeaderAdmin from '../../componentsAdmin/HeaderAdmin/HeaderAdmin'
import HomeAdmin from '../../componentsAdmin/HomeAdmin/HomeAdmin'
import Sidebar from '../../componentsAdmin/Sidebar/Sidebar'
import { useState } from 'react'
import './admin.scss'

import React from 'react'

export default function Admin() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <div className='img-admin'></div>
            </div>
        </div>
    )
}
