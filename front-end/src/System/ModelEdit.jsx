// import React, { useState } from 'react';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import './model.scss';
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const ModelEdit = (props) => {
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [phone, setPhone] = useState('');
//     const [role, setRole] = useState('');
//     const [isactive, setIsActive] = useState('');
//     const [previewImgURL, setPreviewImgURL] = useState('');


//     let navigate = useNavigate();

//     const toggle = () => {
//         props.toggleFromParent();
//     };



//     const handleOnChangeImage = (event) => {
//         let data = event.target.files;
//         let file = data[0];
//         if (file) {
//             let objectUrl = URL.createObjectURL(file);
//             setPreviewImgURL(objectUrl);
//         }
//     };

//     const isValidInputs = () => {
//         let isValid = true;
//         let newCheckInput = { ...checkInput };


//         let reg = /\S+@\S+\.\S+/;
//         if (!reg.test(email)) {
//             newCheckInput.isValidEmail = false;
//             toast.error("Vui lòng nhập đúng giá trị địa chỉ email");
//             isValid = false;
//         }

//         setCheckInput(newCheckInput);
//         return isValid;
//     };

//     // handleEdit = async () => {
//     //     alert("click")
//     // }

//     return (
//         <Modal isOpen={props.isOpen} toggle={toggle} className='model' size="lg" centered>
//             <ModalHeader toggle={toggle}>Edit user</ModalHeader>
//             <ModalBody>
//                 <div className="User-redux-body">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-6">
//                                 <label> <FormattedMessage id="manager-user.username" /></label>
//                                 <input className='form-control'
//                                     type="text"
//                                     onChange={(event) => setUsername(event.target.value)}
//                                     value={username} />
//                             </div>
//                             <div className="col-6">
//                                 <label> <FormattedMessage id="manager-user.role" /></label>
//                                 <select className="form-control">
//                                     <option selected>Choose...</option>
//                                     <option>1</option>
//                                     <option>2</option>
//                                     <option>3</option>
//                                     <option>4</option>
//                                 </select>
//                             </div>
//                             <div className="col-6">
//                                 <label> <FormattedMessage id="manager-user.email" /></label>
//                                 <input className='form-control'
//                                     type="email"
//                                     onChange={(event) => setEmail(event.target.value)}
//                                     value={email} />
//                             </div>
//                             <div className="col-6">
//                                 <label> <FormattedMessage id="manager-user.phone-number" /></label>
//                                 <input className='form-control'
//                                     type="text"
//                                     onChange={(event) => setPhone(event.target.value)}
//                                     value={phone} />
//                             </div>
//                             <div className="col-12">
//                                 <label> <FormattedMessage id="IsActive" /></label>
//                                 <select className="form-control">
//                                     <option selected>Choose...</option>
//                                     <option>Active</option>
//                                     <option>UnActive</option>
//                                 </select>
//                             </div>
//                             <div className="col-12">
//                                 <label> <FormattedMessage id="manager-user.image" /></label>
//                                 <div className="preview-img-container">
//                                     <input id="previewImg" type="file" hidden
//                                         onChange={handleOnChangeImage} />
//                                     <label className="label-upload" htmlFor="previewImg">Tải Ảnh <i className="fas fa-upload"></i></label>
//                                     <div className="preview-image" style={{ backgroundImage: `url(${previewImgURL})` }}></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </ModalBody>
//             <ModalFooter>
//                 <Button color="primary" >
//                     Lưa
//                 </Button>
//                 <Button color="secondary" onClick={toggle}>
//                     Đóng
//                 </Button>
//             </ModalFooter>
//             <ToastContainer />
//         </Modal>
//     );

// }

// const mapStateToProps = state => {
//     return {};
// };

// const mapDispatchToProps = dispatch => {
//     return {};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ModelEdit);



import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './model.scss';
import { ToastContainer, toast } from 'react-toastify';
import { handleEditUser } from '../Service/userService'; // Adjust the import path as needed

class ModelEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            phone: '',
            role: '',
            isactive: '',
            previewImgURL: '',
            checkInput: {
                isValidEmail: true
            }
        };
    }

    componentDidMount() {
        const { currentUser } = this.props;
        if (currentUser) {
            this.setState({
                username: currentUser.UserName,
                email: currentUser.Email,
                phone: currentUser.Phone,
                role: currentUser.RoleID,
                isactive: currentUser.IsActive.data,
                previewImgURL: currentUser.image
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl
            });
        }
    };

    isValidInputs = () => {
        const { email } = this.state;
        let isValid = true;
        let newCheckInput = { ...this.state.checkInput };

        let reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            newCheckInput.isValidEmail = false;
            toast.error("Vui lòng nhập đúng giá trị địa chỉ email");
            isValid = false;
        }

        this.setState({
            checkInput: newCheckInput
        });

        return isValid;
    };

    handleEditUserClick = async () => {
        // if (this.isValidInputs()) {
        //     const { username, email, phone, role, isactive } = this.state;
        //     const userData = {
        //         AccountID: this.props.currentUser.AccountID,
        //         username,
        //         email,
        //         phone,
        //         role,
        //         isActive: isactive
        //     };
        //     try {
        //         await handleEditUser(userData);
        //         toast.success("User updated successfully!");
        //         this.props.onUserUpdated(); // Notify the parent component
        //         this.toggle();
        //     } catch (error) {
        //         toast.error("Error updating user: " + error.message);
        //         console.error(error.message);
        //     }
        // }
    };

    render() {
        const { isOpen } = this.props;
        const { username, email, phone, role, isactive, previewImgURL } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
                <ModalHeader toggle={this.toggle}>Edit user</ModalHeader>
                <ModalBody>
                    <div className="User-redux-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <label> <FormattedMessage id="manager-user.username" /></label>
                                    <input className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ username: event.target.value })}
                                        value={username} />
                                </div>
                                <div className="col-6">
                                    <label> <FormattedMessage id="manager-user.role" /></label>
                                    <select className="form-control"
                                        value={role}
                                        onChange={(event) => this.setState({ role: event.target.value })}>
                                        <option value="">Choose...</option>
                                        <option value="1">Role 1</option>
                                        <option value="2">Role 2</option>
                                        <option value="3">Role 3</option>
                                        <option value="4">Role 4</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label> <FormattedMessage id="manager-user.email" /></label>
                                    <input className='form-control'
                                        type="email"
                                        onChange={(event) => this.setState({ email: event.target.value })}
                                        value={email} />
                                </div>
                                <div className="col-6">
                                    <label> <FormattedMessage id="manager-user.phone-number" /></label>
                                    <input className='form-control'
                                        type="text"
                                        onChange={(event) => this.setState({ phone: event.target.value })}
                                        value={phone} />
                                </div>
                                <div className="col-12">
                                    <label> <FormattedMessage id="IsActive" /></label>
                                    <select className="form-control"
                                        value={isactive}
                                        onChange={(event) => this.setState({ isactive: event.target.value })}>
                                        <option value="">Choose...</option>
                                        <option value="Active">Active</option>
                                        <option value="UnActive">UnActive</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label> <FormattedMessage id="manager-user.image" /></label>
                                    <div className="preview-img-container">
                                        <input id="previewImg" type="file" hidden
                                            onChange={this.handleOnChangeImage} />
                                        <label className="label-upload" htmlFor="previewImg">Tải Ảnh <i className="fas fa-upload"></i></label>
                                        <div className="preview-image" style={{ backgroundImage: `url(${previewImgURL})` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleEditUserClick}>
                        Lưu
                    </Button>
                    <Button color="secondary" onClick={this.toggle}>
                        Đóng
                    </Button>
                </ModalFooter>
                <ToastContainer />
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelEdit);
