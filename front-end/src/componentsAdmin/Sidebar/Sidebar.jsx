// Sidebar.jsx

import React from 'react';
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';
import { Link } from 'react-router-dom'; // Use NavLink for active styling

function Sidebar({ openSidebarToggle, OpenSidebar }) {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsCart3 className='icon_header' /> SHOP
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to="/admin/dashboard">
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin/manage-account">
                        <BsPeopleFill className='icon' /> Manange Account
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin/categories" activeClassName="active">
                        <BsFillGrid3X3GapFill className='icon' /> Categories
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin/inventory" activeClassName="active">
                        <BsListCheck className='icon' /> Inventory
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin/reports" activeClassName="active">
                        <BsMenuButtonWideFill className='icon' /> Reports
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin/settings" activeClassName="active">
                        <BsFillGearFill className='icon' /> Settings
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar;
