import React from 'react';
import "./banner.scss";
import { GoSearch } from "react-icons/go";
import { FaRegHospital } from "react-icons/fa";
import { RiServiceFill } from "react-icons/ri";
import { LiaTeethOpenSolid } from "react-icons/lia";
import { FaUserDoctor } from "react-icons/fa6";

export default function Banner() {
    return (
        <div>
            <div className="header-banner">
                <div className='header-Information'>
                    <div className="header-title">Chào mừng đến với đặt lịch phòng khám</div>
                    <div className="header-title-content">TOÀN DIỆN NHANH CHÓNG</div>
                    <div className="search">
                        <i className='div-search'><GoSearch className='icon-search' /></i>
                        <input className="search-text" type='text' placeholder='Tìm kiếm địa điểm gần nhất'>
                        </input>
                    </div>
                </div>
                <div className="header-detail">
                    <div className="option-clinic">
                        <div className="option-child">
                            <div className='icon-child'><RiServiceFill /></div>
                            <div className='text-child'>Dịch vụ toàn diện</div>
                        </div>
                        <div className="option-child">
                            <div className='icon-child'><LiaTeethOpenSolid className='icon-chuyenkhoa' /></div>
                            <div className='text-child'>Chuyên khoa</div>
                        </div>
                        <div className="option-child">
                            <div className='icon-child'><FaRegHospital className='icon-yte' /></div>
                            <div className='text-child'>Cơ sở y tế </div>
                        </div>
                        <div className="option-child">
                            <div className='icon-child'><FaUserDoctor className='icon-doctor' /></div>
                            <div className='text-child'>Bác sĩ</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
