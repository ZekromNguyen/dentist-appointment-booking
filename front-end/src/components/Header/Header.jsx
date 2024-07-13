import { useEffect, useState } from 'react';
import './header.scss';
import { IoMenuOutline } from "react-icons/io5";
import { FaUser, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaUserClock } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { MdGTranslate } from "react-icons/md";
import { logout } from '../../Service/userService';

export default function Header() {
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    const getAccount = async () => {
        try {
            var accountData = localStorage.getItem('account');
            if (accountData) {
                const parsedAccount = JSON.parse(accountData);
                setAccount(parsedAccount);
                console.log('Account loaded from localStorage:', parsedAccount);
            }
        } catch (error) {
            console.error('Error during getAccount:', error);
        }
    }

    useEffect(() => {
        getAccount();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('account');
            setAccount(null);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="home-header-container">
            <div className="header-content">
                <div className="content-logo">
                    <IoMenuOutline className="icon-menu" />
                    <a href="/" className="header-logo"></a>
                </div>
                <div className="content-option">
                    <div className="child-option1">
                        <div><b>Tất cả</b></div>
                        <div className="sub">Thông tin</div>
                    </div>
                    <div className="child-option2">
                        <div><b>Sống khoẻ</b></div>
                        <div className="sub">Sống tốt mỗi ngày</div>
                    </div>
                    <div className="child-option3">
                        <a href="/booking" className="booking-link">
                            <div><b>Đặt lịch</b></div>
                        </a>
                    </div>
                    <div className="child-option4">
                        <div><b>Vị trí</b></div>
                        <div className="sub">Địa điểm gần nhất</div>
                    </div>
                </div>
                <div className="content-login-register">
            {account ? (
                <div className="logged-in">
                    <FaUser className="icon-user" />
                    <span>Xin chào, {account.user}</span>
                    <div className="dropdown-menu">
                        <Link to={`/profile/${account.id}`}>
                            <FaUser />
                            Profile
                        </Link>
                        <Link to="/settings">
                            <FaCogs />
                            Settings
                        </Link>
                        <button onClick={handleLogout}>
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            ): (
                <div className="content-auth">
                    <div className="auth-left">
                        <FaUser className="icon-user" />
                        <Link to="/Login" className="Login">Login</Link>
                    </div>
                    <div className='auth-right'>
                        <div className="seperate">|</div>
                        <Link to="/Register" className="register">Sign up</Link>
                    </div>
                </div>
            )}
                <div className="content-support">
                    <div className='support-child'>
                        <FaUserClock className="clock-history" />
                        <div>Lịch hẹn</div>
                    </div>
                    <div className="contact-support">
                        <TfiHeadphoneAlt className="contact" />
                        <div>Hỗ trợ</div>
                    </div>
                    <div className="translate">
                        <MdGTranslate className="icon-translate" />
                        {/* <div>Ngôn ngữ</div> */}
                    </div>
                    <div className="languge-vi">VN</div>
                    <div className="languge-en">EN</div>
                </div>
            </div>
        </div>
    );
}
