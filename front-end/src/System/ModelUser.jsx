import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './model.scss';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handelAddUser } from '../Service/userService';

const ModelUser = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [previewImgURL, setPreviewImgURL] = useState('');
    const [checkInput, setCheckInput] = useState({
        isValidUsername: true,
        isValidPassword: true,
        isValidEmail: true,
        isValidPhone: true,
    });
    let navigate = useNavigate();

    const toggle = () => {
        props.toggleFromParent();
    };

    const handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            setPreviewImgURL(objectUrl);
        }
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

        setCheckInput(newCheckInput);
        return isValid;
    };

    const handleAddNewUser = async () => {
        try {
            const response = await handelAddUser({ username, password, email, phone });
            if (response && response.message === "Account created successfully") {

                toast.success("Đăng ký thành công");
            } else {
                toast.error(response.error || "Đã xảy ra lỗi, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    return (
        <Modal isOpen={props.isOpen} toggle={toggle} className='model' size="lg" centered>
            <ModalHeader toggle={toggle}>Create a new user</ModalHeader>
            <ModalBody>
                <div className="User-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <label> <FormattedMessage id="manager-user.username" /></label>
                                <input className={checkInput.isValidUsername ? "form-control" : "is-invalid form-control"}
                                    type="text"
                                    onChange={(event) => setUsername(event.target.value)}
                                    value={username} />
                            </div>
                            <div className="col-6">
                                <label> <FormattedMessage id="manager-user.password" /></label>
                                <input className={checkInput.isValidPassword ? "form-control" : "is-invalid form-control"}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password} />
                            </div>
                            <div className="col-6">
                                <label> <FormattedMessage id="manager-user.email" /></label>
                                <input className={checkInput.isValidEmail ? "form-control" : "is-invalid form-control"}
                                    type="email"
                                    onChange={(event) => setEmail(event.target.value)}
                                    value={email} />
                            </div>
                            <div className="col-6">
                                <label> <FormattedMessage id="manager-user.phone-number" /></label>
                                <input className={checkInput.isValidPhone ? "form-control" : "is-invalid form-control"}
                                    type="text"
                                    onChange={(event) => setPhone(event.target.value)}
                                    value={phone} />
                            </div>
                            <div className="col-12">
                                <label> <FormattedMessage id="manager-user.image" /></label>
                                <div className="preview-img-container">
                                    <input id="previewImg" type="file" hidden
                                        onChange={handleOnChangeImage} />
                                    <label className="label-upload" htmlFor="previewImg">Tải Ảnh <i className="fas fa-upload"></i></label>
                                    <div className="preview-image" style={{ backgroundImage: `url(${previewImgURL})` }}></div>
                                </div>
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
