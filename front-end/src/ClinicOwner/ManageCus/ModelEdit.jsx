import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import { handleEditCustomer } from '../../Service/userService';

class ModelEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerID: '',
            customerName: '',
            username: '',
            email: '',
            phone: '',
            role: '',
            isActive: ''
        };
    }

    componentDidMount() {
        const { currentUser } = this.props;
        if (currentUser && !_.isEmpty(currentUser)) {
            const { Account, CustomerID, CustomerName } = currentUser;
            this.setState({
                customerID: CustomerID,
                customerName: CustomerName,
                username: Account ? Account.UserName : '',
                email: Account ? Account.Email : '',
                phone: Account ? Account.Phone : '',
                role: Account ? Account.RoleID.toString() : '',
                isActive: Account ? (Account.IsActive ? '1' : '0') : ''
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    isValidInputs = () => {
        const { email } = this.state;
        let isValid = true;
        let reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            toast.error("Please enter a valid email address");
            isValid = false;
        }
        return isValid;
    };

    handleEditUserClick = async () => {
        if (this.isValidInputs()) {
            const { username, email, phone, role, isActive } = this.state;
            const { currentUser } = this.props;
            const userData = {
                CustomerID: currentUser.CustomerID,
                CustomerName: currentUser.CustomerName,
                UserName: username,
                Email: email,
                Phone: phone,
                RoleID: parseInt(role, 10),
                IsActive: parseInt(isActive, 10)
            };
            try {
                await handleEditCustomer(userData);
                toast.success("Customer updated successfully!");
                this.toggle();
                this.props.onUserUpdated(); // Notify parent component of update
            } catch (error) {
                toast.error("Error updating customer: " + error.message);
                console.error(error.message);
            }
        }
    };

    render() {
        const { isOpen } = this.props;
        const { customerID, customerName, username, email, phone, role, isActive } = this.state;
        return (
            <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
                <ModalHeader toggle={this.toggle}>Edit Customer</ModalHeader>
                <ModalBody>
                    <div className="User-redux-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <label>Customer ID</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        readOnly
                                        value={customerID}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Customer Name</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        readOnly
                                        value={customerName}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Username</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ username: event.target.value })}
                                        value={username}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Email</label>
                                    <input
                                        className='form-control'
                                        type="email"
                                        onChange={(event) => this.setState({ email: event.target.value })}
                                        value={email}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Phone</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ phone: event.target.value })}
                                        value={phone}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Role</label>
                                    <select readOnly
                                        className='form-control'
                                        onChange={(event) => this.setState({ role: event.target.value })}
                                        value={role}
                                    >
                                        <option value="1">Customer</option>
                                        {/* <option value="2">Dentist</option>
                                        <option value="3">Clinic Owner</option>
                                        <option value="4">Admin</option> */}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label>Is Active</label>
                                    <select
                                        className='form-control'
                                        onChange={(event) => this.setState({ isActive: event.target.value })}
                                        value={isActive}
                                    >
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleEditUserClick}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
                <ToastContainer />
            </Modal>
        );
    }
}

export default ModelEdit;
