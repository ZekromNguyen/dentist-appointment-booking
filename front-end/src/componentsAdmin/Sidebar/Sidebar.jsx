import React from 'react';
import { BsFillGearFill, BsGrid1X2Fill, BsPeopleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../Service/userService'; // Ensure this path is correct

const Sidebar = ({ openSidebarToggle, OpenSidebar, setAccount }) => {
    const navigate = useNavigate();

    console.log("Received setAccount in Sidebar:", setAccount);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('account');
            if (typeof setAccount === 'function') {
                setAccount(null);
            } else {
                console.error('setAccount is not a function');
            }
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <Link to="/admin/dashboard">
                        <BsFillGearFill className='icon_header' /> Admin
                    </Link>
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
                        <BsPeopleFill className='icon' /> Manage Account
                    </Link>
                </li>
                <li className='sidebar-list-item' onClick={handleLogout}>
                    <span className='logout'>
                        <BsFillGearFill className='icon' /> Logout
                    </span>
                </li>
                {/* Uncomment and add links for other menu items as needed */}
                {/* <li className='sidebar-list-item'>
                    <Link to="/admin/categories">
                        <BsFillGrid3X3GapFill className='icon' /> Categories
                    </Link>
                </li> */}
                {/* <li className='sidebar-list-item'>
                    <Link to="/admin/inventory">
                        <BsListCheck className='icon' /> Inventory
                    </Link>
                </li> */}
                {/* <li className='sidebar-list-item'>
                    <Link to="/admin/reports">
                        <BsMenuButtonWideFill className='icon' /> Reports
                    </Link>
                </li> */}
                {/* <li className='sidebar-list-item'>
                    <Link to="/admin/settings">
                        <BsFillGearFill className='icon' /> Settings
                    </Link>
                </li> */}
            </ul>
        </aside>
    );
};

export default Sidebar;
