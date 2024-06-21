import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUSer, deleteUser } from '../Service/userService';
import ModelUser from './ModelUser';
import ModelEdit from './ModelEdit';
import ModelAddDentist from './ModelAddDentist'; // Import the new component
import './UserManage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUser: [],
            isOpenModalUser: false,
            isOpenModalEdit: false,
            isOpenModalAddDentist: false, // Add state for the new modal
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.handleGetAllUsers();
    }

    handleGetAllUsers = async () => {
        let response = await getAllUSer('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUser: response.account
            });
        }
        console.log('get user from back-end', response);
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        });
    };

    handleAddNewDentist = () => {
        this.setState({
            isOpenModalAddDentist: true // Open the new modal
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        });
    };

    toggleAddDentistModal = () => {
        this.setState({
            isOpenModalAddDentist: !this.state.isOpenModalAddDentist // Toggle the new modal
        });
    };

    toggleEditModal = () => {
        this.setState({
            isOpenModalEdit: !this.state.isOpenModalEdit
        });
    };

    handleDelete = async (user) => {
        console.log('check', user);
        try {
            let res = await deleteUser(user.AccountID);
            if (res && res.data && res.data.errCode === 0) {
                await this.handleGetAllUsers();
            } else {
                alert(res.data.errMessage);
            }
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    handleEdit = (user) => {
        console.log('check edit user', user);
        this.setState({
            isOpenModalEdit: true,
            userEdit: user
        });
    };

    handleUserUpdated = () => {
        this.setState({
            isOpenModalEdit: false,
            isOpenModalAddDentist: false // Close the dentist modal after adding
        });
        this.handleGetAllUsers();
    };

    render() {
        console.log('check render', this.state.arrUser);
        let arrUser = this.state.arrUser;
        return (
            <div className='Manage-user'>
                <ModelUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    test={'abc'}
                />
                {this.state.isOpenModalEdit &&
                    <ModelEdit
                        isOpen={this.state.isOpenModalEdit}
                        toggleFromParent={this.toggleEditModal}
                        currentUser={this.state.userEdit}
                        onUserUpdated={this.handleUserUpdated} // Pass the callback to handle user update
                    />}
                {this.state.isOpenModalAddDentist && // Add the new modal
                    <ModelAddDentist
                        isOpen={this.state.isOpenModalAddDentist}
                        toggleFromParent={this.toggleAddDentistModal}
                        onDentistAdded={this.handleUserUpdated} // Handle dentist added
                    />}
                <div className='mt-100'>Manage CRUD User</div>
                <button className='btn btn-primary px-3' onClick={this.handleAddNewUser}>
                    Add new user
                </button>
                <button className='btn btn-primary px-3 ml-2' onClick={this.handleAddNewDentist}>
                    Add new dentist
                </button>
                <div className='user-table mt-30 mx-10'>
                    <table id='customers'>
                        <thead>
                            <tr>
                                <th>AccountID</th>
                                <th>UserName</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>RoleID</th>
                                <th>IsActive</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUser && arrUser.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.AccountID}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.Phone}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.RoleID}</td>
                                        <td>{item.IsActive.data}</td>
                                        <td>
                                            <button onClick={() => { this.handleEdit(item) }}>Edit</button>
                                            <button onClick={() => { this.handleDelete(item) }}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
