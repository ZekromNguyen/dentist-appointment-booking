import React, { useEffect, useState, useRef } from 'react';
import './header.scss';
import { IoMenuOutline } from "react-icons/io5";
import { FaUser, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaUserClock } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { MdGTranslate } from "react-icons/md";
import { logout } from '../../Service/userService';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

export default function Header() {
    const [account, setAccount] = useState(null);
    const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility
    const navigate = useNavigate();
    const menuRef = useRef(null);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    const toggleMenu = () => {
        setShowMenu(!showMenu); // Toggle showMenu state
    };

    return (
        <div className="home-header-container">
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/" className='header-logo'></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link className='nav-header' as={Link} to="/">Home</Nav.Link>
                            <Nav.Link className='nav-header' as={Link} to="/booking">Book Appointment</Nav.Link>
                            <Nav.Link className='nav-header' as={Link} to="/booking">Appointments</Nav.Link>
                            <Nav.Link className='nav-header' as={Link} to="/booking">Support</Nav.Link>
                            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/somewhere">Somewhere</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/else">Else</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/somewhere">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            {account ? (
                                <NavDropdown title={`Hello, ${account.user}`} id="account-nav-dropdown">
                                    <NavDropdown.Item as={Link} to={`/profile/${account.id}`}>
                                        <FaUser /> Profile
                                    </NavDropdown.Item>
                                    {/* <NavDropdown.Item as={Link} to="/settings">
                                        <FaCogs /> Settings
                                    </NavDropdown.Item> */}
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav>
                                    <Nav.Link as={Link} to="/Login" className="Login">
                                        <FaUser className="icon-user" /> Login
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/Register" className="register">
                                        Sign up
                                    </Nav.Link>
                                </Nav>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
