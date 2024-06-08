import React from 'react';
import './header.scss';
import { IoMenuOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUserClock } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { MdGTranslate } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
export default function Header() {
    return (
        <div className="home-header-container">
            <div className="header-content">
                <div className="content-logo">
                    <IoMenuOutline className="icon-menu" />
                    <a href="/" className="header-logo" ></a>
                </div>
                <div className="content-option">
                    <div className="child-option1">
                        <div><b>Tất cả</b></div>
                        <div className="sub">Thông tin</div>
                    </div>
                    <div className="child-option2">
                        <div><b>Sống khoẻ</b></div>
                        <div className="sub">Sống tốt mỗi ngày</div>
                    </div>

                    <div className="child-option3">
                        <div><b>Đặt lịch</b></div>
                        <div className="sub">Đặt ngay để gặp bác sĩ</div>
                    </div>

                    <div className="child-option4">
                        <div><b>Vị trí</b></div>
                        <div className="sub">Địa điểm gần nhất</div>
                    </div>

                </div>
                <div className="content-login">
                    <FaUser className="icon-user" />
                    <Link to="/Login" className="Login">Login</Link>
                    <div className="seperate">|</div>
                </div>
                <div className="content-register">
                    <Link to="/Register" className="register">Sign up</Link>
                </div>

                <div className="content-support">
                    <div className='support-child'>
                        <FaUserClock className="clock-history" />
                        <div>Lịch hẹn</div>
                    </div>
                    <div className="contact-support">
                        <TfiHeadphoneAlt className="contact" />
                        <div >Hỗ trợ</div>
                    </div>
                    <div className="translate">
                        <MdGTranslate className="icon-translate" />
                        <div>Ngôn ngữ</div>
                    </div>
                    <div className="languge-vi">VN</div>
                    <div className="languge-en">EN</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.app.languge,
        contentOfConfirmModal: state.app.contentOfConfirmModal
    }
}