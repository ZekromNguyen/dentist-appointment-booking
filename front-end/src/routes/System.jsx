// import React, { Component } from 'react';
// import { connect } from "react-redux";
// import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../System/UserManage';
// import ManageDoctor from '../System/ManageDoctor';


// class System extends Component {
//     render() {
//         const { systemMenuPath } = this.props;
//         return (
//             <div className="system-container">
//                 <div className="system-list">
//                     <Switch>
//                         <Route path="system/user-manage" element={UserManage} />
//                         <Route path="system/manage-doctor" element={ManageDoctor} />
//                         <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
//                     </Switch>
//                 </div>
//             </div>
//         );
//     }
// }

// const mapStateToProps = state => {
//     return {
//         systemMenuPath: state.app.systemMenuPath
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(System);
import React, { Component } from 'react';
import { connect } from "react-redux";
import { Navigate, Route, Routes } from 'react-router-dom';
import UserManage from '../System/UserManage';


class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Routes>
                        <Route path="user-manage" element={<UserManage />} />
                   
                        <Route path="*" element={<Navigate to={systemMenuPath} />} />
                    </Routes>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
