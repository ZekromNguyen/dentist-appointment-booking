
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IoLogOutSharp } from "react-icons/io5";
import * as actions from "../../store/actions";
import Navigator from '../Navigate/Navigator';
import { doctorMenu } from './menuApp';
import './HeaderSystem.scss';

class HeaderSystemDoctor extends Component {
    render() {
        const { processLogout } = this.props;

        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={doctorMenu} />
                </div>
                <div className="btn btn-logout" onClick={processLogout}>
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

