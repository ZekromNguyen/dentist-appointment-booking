// import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import './model.scss';
// import { ToastContainer, toast } from 'react-toastify';
// import { handleEditUser } from '../Service/userService';
// import _ from 'lodash';

// class ModelEdit extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             username: '',
//             email: '',
//             phone: '',
//             role: '',
//             isactive: '',
//         };
//     }

//     componentDidMount() {
//         let user = this.props.currentUser;
//         if (user && !_.isEmpty(user)) {
//             this.setState({
//                 username: user.UserName,
//                 email: user.Email,
//                 phone: user.Phone,
//                 role: user.RoleID,
//                 isactive: user.IsActive.data
//             });
//         }
//     }

//     toggle = () => {
//         this.props.toggleFromParent();
//     };

//     handleOnChangeImage = (event) => {
//         let data = event.target.files;
//         let file = data[0];
//         if (file) {
//             let objectUrl = URL.createObjectURL(file);
//             this.setState({
//                 previewImgURL: objectUrl
//             });
//         }
//     };

//     isValidInputs = () => {
//         const { email } = this.state;
//         let isValid = true;
//         let reg = /\S+@\S+\.\S+/;
//         if (!reg.test(email)) {
//             toast.error("Vui lòng nhập đúng giá trị địa chỉ email");
//             isValid = false;
//         }
//         return isValid;
//     };

//     handleEditUserClick = async () => {
//         if (this.isValidInputs()) {
//             const { username, email, phone, role, isactive } = this.state;
//             const userData = {
//                 AccountID: this.props.currentUser.AccountID,
//                 username,
//                 email,
//                 phone,
//                 role,
//                 isActive: isactive
//             };
//             try {
//                 await handleEditUser(userData);
//                 toast.success("User updated successfully!");
//                 this.props.onUserUpdated(); // Notify the parent component
//                 this.toggle();
//             } catch (error) {
//                 toast.error("Error updating user: " + error.message);
//                 console.error(error.message);
//             }
//         }
//     };

//     render() {
//         const { isOpen } = this.props;
//         const { username, email, phone, role, isactive, previewImgURL } = this.state;
//         return (
//             <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
//                 <ModalHeader toggle={this.toggle}>Edit user</ModalHeader>
//                 <ModalBody>
//                     <div className="User-redux-body">
//                         <div className="container">
//                             <div className="row">
//                                 <div className="col-6">
//                                     <label> <FormattedMessage id="manager-user.username" /></label>
//                                     <input className='form-control'
//                                         type="text"
//                                         onChange={(event) => this.setState({ username: event.target.value })}
//                                         value={username} />
//                                 </div>
//                                 <div className="col-6">
//                                     <label> <FormattedMessage id="manager-user.role" /></label>
//                                     <input className="form-control"
//                                         type='text'
//                                         onChange={(event) => this.setState({ role: event.target.value })}
//                                         value={role}>
//                                     </input>
//                                 </div>
//                                 <div className="col-6">
//                                     <label> <FormattedMessage id="manager-user.email" /></label>
//                                     <input className='form-control'
//                                         type="email"
//                                         onChange={(event) => this.setState({ email: event.target.value })}
//                                         value={email} />
//                                 </div>
//                                 <div className="col-6">
//                                     <label> <FormattedMessage id="manager-user.phone-number" /></label>
//                                     <input className='form-control'
//                                         type="text"
//                                         onChange={(event) => this.setState({ phone: event.target.value })}
//                                         value={phone} />
//                                 </div>
//                                 <div className="col-12">
//                                     <label> <FormattedMessage id="IsActive" /></label>
//                                     <select className="form-control"
//                                         value={isactive}
//                                         onChange={(event) => this.setState({ isactive: event.target.value })}>
//                                         <option value="">Choose...</option>
//                                         <option value="1">Active</option>
//                                         <option value="0">UnActive</option>
//                                     </select>
//                                 </div>
//                                 <div className="col-12">
//                                     <label> <FormattedMessage id="manager-user.image" /></label>
//                                     <div className="preview-img-container">
//                                         <input id="previewImg" type="file" hidden
//                                             onChange={this.handleOnChangeImage} />
//                                         <label className="label-upload" htmlFor="previewImg">Tải Ảnh <i className="fas fa-upload"></i></label>
//                                         <div className="preview-image" style={{ backgroundImage: `url(${previewImgURL})` }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button color="primary" onClick={this.handleEditUserClick}>
//                         Lưu
//                     </Button>
//                     <Button color="secondary" onClick={this.toggle}>
//                         Đóng
//                     </Button>
//                 </ModalFooter>
//                 <ToastContainer />
//             </Modal>
//         );
//     }
// }

// const mapStateToProps = state => {
//     return {};
// };

// const mapDispatchToProps = dispatch => {
//     return {};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ModelEdit);

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';

class ModelEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            phone: '',
            role: '',
            isActive: '' // Initialize as 0 or 1
        };
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                username: user.UserName,
                email: user.Email,
                phone: user.Phone,
                role: user.RoleID,
                isActive: user.IsActive.data  // Ensure isActive is 0 or 1
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
            const userData = {
                AccountID: this.props.currentUser.AccountID,
                UserName: username,
                Email: email,
                Phone: phone,
                RoleID: role,
                IsActive: parseInt(isActive, 10) // Ensure isActive is a number
            };
            try {
                await this.props.editUser(userData);
                toast.success("User updated successfully!");
                this.toggle();
                this.props.onUserUpdated(); // Call onUserUpdated after updating
            } catch (error) {
                toast.error("Error updating user: " + error.message);
                console.error(error.message);
            }
        }
    };

    render() {
        const { isOpen } = this.props;
        const { username, email, phone, role, isActive } = this.state;
        return (
            <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
                <ModalHeader toggle={this.toggle}>Edit user</ModalHeader>
                <ModalBody>
                    <div className="User-redux-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <label>Username</label>
                                    <input className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ username: event.target.value })}
                                        value={username} />
                                </div>
                                <div className="col-6">
                                    <label>Email</label>
                                    <input className='form-control'
                                        type="email"
                                        onChange={(event) => this.setState({ email: event.target.value })}
                                        value={email} />
                                </div>
                                <div className="col-6">
                                    <label>Phone</label>
                                    <input className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ phone: event.target.value })}
                                        value={phone} />
                                </div>
                                <div className="col-6">
                                    <label>Role</label>
                                    <select className='form-control'
                                        onChange={(event) => this.setState({ role: event.target.value })}
                                        value={role}>
                                        <option value="1">Customer</option>
                                        <option value="2">Dentist</option>
                                        <option value="3">Clinic Owner</option>
                                        <option value="4">Admin</option>
                                    </select >

                                </div>
                                <div className="col-6">
                                    <label>Is Active</label>
                                    <select className='form-control'
                                        onChange={(event) => this.setState({ isActive: event.target.value })}
                                        value={isActive}>
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
            </Modal>
        );
    }
}

export default ModelEdit;