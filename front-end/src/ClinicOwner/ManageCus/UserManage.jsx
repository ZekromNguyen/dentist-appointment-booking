// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { getAllUSer, deleteUser, handleEditUser, getAllCustomer } from '../../Service/userService';
// import ModelUser from '../ModelAddAccount/ModelUser';
// import ModelEdit from './ModelEdit';
// import './UserManage.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';

// class UserManage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             arrUser: [],
//             arrCustomer: [],
//             combinedArray: [], // State to hold combined data
//             isOpenModalUser: false,
//             isOpenModalEdit: false,
//             isOpenModalAddDentist: false,
//             userEdit: {}
//         };
//     }

//     async componentDidMount() {
//         await this.handleGetAllUsers();
//         await this.handleGetAllCustomers();
//         this.combineUserData(); // Combine data after fetching both users and customers
//     }

//     handleGetAllCustomers = async () => {
//         let response = await getAllCustomer('ALL');
//         if (response && response.errCode === 0) {
//             this.setState({
//                 arrCustomer: response.account
//             });
//         }
//         console.log('get cus from back-end', response);
//     }

//     handleGetAllUsers = async () => {
//         let response = await getAllUSer('ALL');
//         if (response && response.errCode === 0) {
//             this.setState({
//                 arrUser: response.account
//             });
//         }
//         console.log('get user from back-end', response);
//     };

//     combineUserData = () => {
//         const { arrUser, arrCustomer } = this.state;

//         // Combine user and customer data based on AccountID
//         const combinedArray = arrUser.map(user => {
//             const customer = arrCustomer.find(cust => cust.AccountID === user.AccountID) || {};
//             return {
//                 ...user,
//                 ...customer
//             };
//         });

//         this.setState({ combinedArray });
//     }

//     handleAddNewUser = () => {
//         this.setState({
//             isOpenModalUser: true
//         });
//     };

//     toggleUserModal = () => {
//         this.setState({
//             isOpenModalUser: !this.state.isOpenModalUser
//         });
//     };

//       toggleEditModal = () => {
//         this.setState({
//             isOpenModalEdit: !this.state.isOpenModalEdit
//         });
//     };

//     handleDelete = async (user) => {
//         console.log('Deleting user:', user);
//         try {
//             let res = await deleteUser(user.AccountID);
//             if (res && res.errCode === 0) {
//                 const updatedUsers = this.state.arrUser.filter(item => item.AccountID !== user.AccountID);
//                 this.setState({
//                     arrUser: updatedUsers
//                 });
//                 this.combineUserData(); // Update combined data after deleting
//             } else {
//                 alert(res.errMessage);
//             }
//             console.log(res);
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             alert('Error deleting user. Please try again later.');
//         }
//     };

//     handleEdit = (user) => {
//         console.log('check edit user', user);
//         this.setState({
//             isOpenModalEdit: true,
//             userEdit: user
//         });
//     };

//     handleUserUpdated = () => {
//         this.setState({
//             isOpenModalEdit: false,
//             isOpenModalAddDentist: false
//         });
//         this.handleGetAllUsers();
//         this.handleGetAllCustomers();
//     };

//     handleUpdated = async (user) => {
//         let res = await handleEditUser(user);
//         console.log('user', res);
//         this.handleUserUpdated();
//     };

//     render() {
//         console.log('check render', this.state.arrUser);
//         console.log('check cus', this.state.arrCustomer);
//         console.log('combined array', this.state.combinedArray);
//         return (
//             <div className='Manage-user'>
//                 <ModelUser
//                     isOpen={this.state.isOpenModalUser}
//                     toggleFromParent={this.toggleUserModal}
//                     test={'abc'}
//                 />
//                 {this.state.isOpenModalEdit &&
//                     <ModelEdit
//                         isOpen={this.state.isOpenModalEdit}
//                         toggleFromParent={this.toggleEditModal}
//                         currentUser={this.state.userEdit}
//                         editUser={this.handleUpdated}
//                         onUserUpdated={this.handleUserUpdated}
//                     />}
//                 <div className='User-title'>Manage Customer</div>
//                 <button className='buttonAddUser' onClick={this.handleAddNewUser}>
//                     Add new customer
//                 </button>
//                 <div className='user-table mt-30 mx-10'>
//                     <table id='combined'>
//                         <thead>
//                             <tr>
//                                 <th>CustomerID</th>
//                                 <th>CustomerName</th>
//                                 <th>AccountID</th>
//                                 <th>UserName</th>
//                                 <th>Phone</th>
//                                 <th>Email</th>
//                                 <th>RoleID</th>
//                                 <th>IsActive</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {this.state.combinedArray && this.state.combinedArray.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.CustomerID}</td>
//                                     <td>{item.CustomerName}</td>
//                                     <td>{item.AccountID}</td>
//                                     <td>{item.UserName}</td>
//                                     <td>{item.Phone}</td>
//                                     <td>{item.Email}</td>
//                                     <td>{item.RoleID}</td>
//                                     <td>{item.IsActive ? item.IsActive.data : 'N/A'}</td>
//                                     <td>
//                                         <button onClick={() => { this.handleEdit(item) }}>Edit</button>
//                                         <button onClick={() => { this.handleDelete(item) }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     }
// }

// const mapStateToProps = state => {
//     return {};
// };

// const mapDispatchToProps = dispatch => {
//     return {};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(UserManage);


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllCustomer, deleteUser, handleEditUser } from '../../Service/userService';
import ModelUser from '../ModelAddCus/ModelAddCus';
import ModelEdit from './ModelEdit';
import './UserManage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrCustomer: [],
            isOpenModalUser: false,
            isOpenModalEdit: false,
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.handleGetAllCustomers();
    }

    handleGetAllCustomers = async () => {
        let response = await getAllCustomer('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrCustomer: response.account
            });
        }
        console.log('get cus from back-end', response);
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        });
        this.handleGetAllCustomers();
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        });
        this.handleGetAllCustomers();
    };

    toggleEditModal = () => {
        this.setState({
            isOpenModalEdit: !this.state.isOpenModalEdit
        });
    };

    handleDelete = async (customer) => {
        console.log('Deleting customer:', customer);
        try {
            let res = await deleteUser(customer.AccountID);
            if (res && res.errCode === 0) {
                const updatedCustomers = this.state.arrCustomer.filter(item => item.AccountID !== customer.AccountID);
                this.setState({
                    arrCustomer: updatedCustomers
                });
            } else {
                alert(res.errMessage);
            }
            console.log(res);
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer. Please try again later.');
        }
    };

    handleEdit = (customer) => {
        console.log('Editing customer:', customer);
        this.setState({
            isOpenModalEdit: true,
            userEdit: customer
        });
        this.handleGetAllCustomers();
    };

    handleUserUpdated = () => {
        this.setState({
            isOpenModalEdit: false
        });

    };

    handleUpdated = async (customer) => {
        let res = await handleEditUser(customer);
        console.log('Updated customer:', res);
        this.handleUserUpdated();

    };

    render() {
        console.log('Render customers:', this.state.arrCustomer);
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
                        editUser={this.handleUpdated}
                        onUserUpdated={this.handleUserUpdated}
                    />}
                <div className='User-title'>Manage Customer</div>
                <button className='buttonAddUser' onClick={this.handleAddNewUser}>
                    Add new customer
                </button>
                <div className='user-table mt-30 mx-10'>
                    <table id='combined'>
                        <thead>
                            <tr>
                                <th>CustomerID</th>
                                <th>CustomerName</th>
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
                            {this.state.arrCustomer && this.state.arrCustomer.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.CustomerID}</td>
                                    <td>{customer.CustomerName}</td>
                                    <td>{customer.AccountID}</td>
                                    <td>{customer.Account ? customer.Account.UserName : 'N/A'}</td>
                                    <td>{customer.Account ? customer.Account.Phone : 'N/A'}</td>
                                    <td>{customer.Account ? customer.Account.Email : 'N/A'}</td>
                                    <td>{customer.Account ? customer.Account.RoleID : 'N/A'}</td>
                                    <td>{customer.Account ? (customer.Account.IsActive ? 'Active' : 'Inactive') : 'N/A'}</td>
                                    <td>
                                        <button onClick={() => this.handleEdit(customer)}>Edit</button>
                                        <button onClick={() => this.handleDelete(customer)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
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
