
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IoLogOutSharp } from "react-icons/io5";
import * as actions from "../../store/actions";
import Navigator from '../Navigate/Navigator';
import { doctorMenu } from './menuApp';
import './HeaderSystem.scss';
import { logout } from '../../Service/userService';
class HeaderSystemDoctor extends Component {

    handleLogout = () => {
        try {
            logout();
            localStorage.removeItem('account'); // Xóa dữ liệu người dùng khỏi localStorage
            window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập

        } catch (error) {
            console.error('Error logging out:', error);
        }

    };
    render() {


        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={doctorMenu} />
                </div>
                <div className="btn btn-logout" onClick={this.handleLogout}>
                    <i className="fas fa-sign-out-alt">
                        <a href='/login'>
                            <IoLogOutSharp />
                        </a>
                    </i>
                    Logout
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSystemDoctor);

