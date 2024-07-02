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
import UserManage from '../ClinicOwner/ManageCus/UserManage';
import DoctorManage from '../ClinicOwner/ManageDentist/DoctorManage';
import ScheduleManage from '../ClinicOwner/ScheduleManage'
import BookingManager from '../ClinicOwner/BookingManager';
import Treatment from '../pages/Doctor/Treatment';


class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Routes>
                        <Route path="user-manage" element={<UserManage />} />
                        <Route path="doctor-manage" element={<DoctorManage />} />
                        <Route path="manage-schedule" element={<ScheduleManage />} />
                        <Route path="manage-booking" element={<BookingManager />} />
                        <Route path="treatment" element={<Treatment />} />
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
