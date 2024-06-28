import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUSer, deleteUser, handleEditUser } from '../../Service/userService';
import ModelUser from '../../System/ModelUser';
import ModelEdit from '../../System/ModelEdit';
import './manage.scss';
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



    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        });
        //window.location.reload() có thể dùng cách này để người dùng biết được đã load lại trang
        this.handleGetAllUsers();
    };



    toggleEditModal = () => {
        this.setState({
            isOpenModalEdit: !this.state.isOpenModalEdit
        });
    };

    handleDelete = async (user) => {
        console.log('Deleting user:', user);
        try {
            let res = await deleteUser(user.AccountID);
            if (res && res.errCode === 0) {
                // Remove the deleted user from the state array
                const updatedUsers = this.state.arrUser.filter(item => item.AccountID !== user.AccountID);
                this.setState({
                    arrUser: updatedUsers
                });
            } else {
                alert(res.errMessage);
            }
            console.log(res);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again later.');
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
            isOpenModalEdit: false, // Close the edit modal after updating
            isOpenModalAddDentist: false // Close the dentist modal after adding
        });
        this.handleGetAllUsers();
    };

    handleUpdated = async (user) => {
        let res = await handleEditUser(user);
        console.log('user', res);
        this.handleUserUpdated(); // Call handleUserUpdated after updating user
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
                        editUser={this.handleUpdated} // Pass the callback to handle user update
                        onUserUpdated={this.handleUserUpdated} // Pass handleUserUpdated as prop
                    />}
                <div className='manage-title'>Manage Account</div>
                <button className='Addbutton' onClick={this.handleAddNewUser}>
                    Add new user
                </button>
                <div className='user-table mt-30 mx-10'>
                    <table id='accounts'>
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
                                            <button className='Editbutton' onClick={() => { this.handleEdit(item) }}>Edit</button>
                                            <button className='Deletebutton' onClick={() => { this.handleDelete(item) }}>Delete</button>
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
