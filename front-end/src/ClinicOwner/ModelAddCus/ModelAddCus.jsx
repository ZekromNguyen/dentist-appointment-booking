import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handelAddUser } from '../../Service/userService';
import './modelAddCus.scss';

const ModelUser = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [roleID, setRoleID] = useState('1');
    const [name, setName] = useState('');
    const [checkInput, setCheckInput] = useState({
        isValidUsername: true,
        isValidPassword: true,
        isValidEmail: true,
        isValidPhone: true,
        isValidRoleID: true,
        isValidName: true
    });

    let navigate = useNavigate();

    const toggle = () => {
        props.toggleFromParent();
    };

    const isValidInputs = () => {
        let isValid = true;
        let newCheckInput = { ...checkInput };

        if (!username) {
            newCheckInput.isValidUsername = false;
            toast.error("Tên người dùng bắt buộc");
            isValid = false;
        } else {
            newCheckInput.isValidUsername = true;
        }

        if (!password) {
            newCheckInput.isValidPassword = false;
            toast.error("Mật khẩu bắt buộc");
            isValid = false;
        } else {
            newCheckInput.isValidPassword = true;
        }

        let reg = /\S+@\S+\.\S+/;
        if (!email || !reg.test(email)) {
            newCheckInput.isValidEmail = false;
            toast.error("Vui lòng nhập đúng giá trị địa chỉ email");
            isValid = false;
        } else {
            newCheckInput.isValidEmail = true;
        }

        if (!phone) {
            newCheckInput.isValidPhone = false;
            toast.error("Số điện thoại bắt buộc");
            isValid = false;
        } else {
            newCheckInput.isValidPhone = true;
        }

        if (roleID === "1" && !name) {
            newCheckInput.isValidName = false;
            toast.error("Tên khách hàng bắt buộc");
            isValid = false;
        }
        setCheckInput(newCheckInput);
        return isValid;
    };

    const handleAddNewUser = async () => {
        let check = isValidInputs();
        if (check === true) {
            try {
                const response = await handelAddUser({
                    username,
                    password,
                    email,
                    phone,
                    roleID,
                    name,
                });
                if (response && response.message === "Account created successfully") {
                    toast.success("Đăng ký thành công");
                    setUsername('');
                    setPassword('');
                    setEmail('');
                    setPhone('');
                    setRoleID('1');
                    setName('');
                    setCheckInput({
                        isValidUsername: true,
                        isValidPassword: true,
                        isValidEmail: true,
                        isValidPhone: true,
                        isValidRoleID: true,
                        isValidName: true
                    });
                } else {
                    toast.error(response.error || "Đã xảy ra lỗi, vui lòng thử lại.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
            }
        }
    };

    return (
        <Modal isOpen={props.isOpen} toggle={toggle} className='model' size="lg" centered>
            <ModalHeader toggle={toggle}>Create a new customer</ModalHeader>
            <ModalBody>
                <div className="User-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <label><FormattedMessage id="manager-user.username" /></label>
                                <input className={checkInput.isValidUsername ? "form-control" : "is-invalid form-control"}
                                    type="text"
                                    onChange={(event) => setUsername(event.target.value)}
                                    value={username} />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manager-user.password" /></label>
                                <input className={checkInput.isValidPassword ? "form-control" : "is-invalid form-control"}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password} />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manager-user.email" /></label>
                                <input className={checkInput.isValidEmail ? "form-control" : "is-invalid form-control"}
                                    type="email"
                                    onChange={(event) => setEmail(event.target.value)}
                                    value={email} />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manager-user.phone-number" /></label>
                                <input className={checkInput.isValidPhone ? "form-control" : "is-invalid form-control"}
                                    type="text"
                                    onChange={(event) => setPhone(event.target.value)}
                                    value={phone} />
                            </div>
                            <div className="col-6">
                                <label>Role</label>
                                <select className={checkInput.isValidRoleID ? "form-control" : "is-invalid form-control"}
                                    onChange={(event) => setRoleID(event.target.value)}
                                    value={roleID}>
                                    <option value="1">Customer</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label>Customer Name</label>
                                <input className={checkInput.isValidName ? "form-control" : "is-invalid form-control"}
                                    type="text"
                                    onChange={(event) => setName(event.target.value)}
                                    value={name} />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleAddNewUser}>
                    Thêm mới
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Đóng
                </Button>
            </ModalFooter>
            <ToastContainer />
        </Modal>
    );
};

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelUser);
