
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IoLogOutSharp } from "react-icons/io5";
import * as actions from "../../store/actions";
import Navigator from '../Navigate/Navigator';
import { adminMenu } from './menuApp';
import './HeaderSystem.scss';
import { logout } from '../../Service/userService';

class HeaderSystemAdmin extends Component {
    handleLogout = () => {
        logout();
        localStorage.removeItem('account'); // Xóa dữ liệu người dùng khỏi localStorage
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
    };

    render() {

        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
                </div>
                <div className="btn btn-logout" onClick={this.handleLogout}>
                    <i className="fas fa-sign-out-alt">
                        <a href='/login'>
                            <IoLogOutSharp />
                        </a>
                    </i>
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSystemAdmin);

