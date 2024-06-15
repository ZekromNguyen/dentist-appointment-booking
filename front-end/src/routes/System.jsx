import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../System/UserManage';
import ProductManage from '../System/ProductManage';
import RegisterPackageGroupOrAcc from '../System/RegisterPackageGroupOrAcc';

class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Switch>
                        <Route path="/system/user-manage" element={UserManage} />
                        <Route path="/system/product-manage" element={ProductManage} />
                        <Route path="/system/register-package-group-or-account" element={RegisterPackageGroupOrAcc} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
