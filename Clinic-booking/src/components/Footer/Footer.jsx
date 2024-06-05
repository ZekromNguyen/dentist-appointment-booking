import React from 'react';
import './footer.scss';
import { LuMapPin } from "react-icons/lu";
import { FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { CiHospital1 } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";


export default function Footer() {
    return (
        <div className='footer'>
            <div className='footer-info'>
                <div className='footer-contact'>
                    <div className='contact-header'>Booking clinic</div>
                    <div className='contact-map'>
                        <LuMapPin className='icon-footer' />
                        <div>Lô E2a-7, Đường D1 Khu Công nghệ cao, Phường Long Thạnh Mỹ, Thủ Đức, TP. Hồ Chí Minh. </div>
                    </div>
                    <div className='sdt-footer'>
                        <FaPhone className='icon-footer' />
                        <div>09123444656</div>
                    </div>
                    <div className='mail-footer'>
                        <CiMail className='icon-footer' />
                        <div>FPT123@gmail.com</div>
                    </div>
                </div>
                <div className='footer-policy'>
                    <div className='policy-header'>Chính sách</div>
                    <div className='text-footer'>Chính sách bảo mật</div>
                    <div className='text-footer'>Chính sách khách hàng</div>
                    <div className='text-footer'>Chính sách liện hệ</div>
                    <div className='text-footer'>Chính sách người dùng</div>
                </div>
                <div className='footer-company'>
                    <div className='company-header'>Bệnh viện hợp tác</div>
                    <div className='company-detail'>
                        <div className='benhvien'>
                            <CiHospital1 className='icon-footer' />
                            <div>Bệnh viên Hữa Nghĩa</div>
                        </div>
                        <div className='benhvien'>
                            <CiHospital1 className='icon-footer' />
                            <div>Bệnh viên Việt Đức</div>
                        </div>
                        <div className='benhvien'>
                            <CiHospital1 className='icon-footer' />
                            <div>Bệnh viên Thủ Đức</div>
                        </div>
                        <div className='benhvien'>
                            <CiHospital1 className='icon-footer' />
                            <div>Bệnh viên Phú Thọ</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='footer-logo'>
                <div className='logo-left'>
                    @2024 FPT
                </div>
                <div className='logo-right'>
                    <a className='logo-tiktok' href='https://www.tiktok.com/@my__clinic/video/7125432411772423451?q=clinic&t=1717574742790' >
                        <FaTiktok />
                    </a>
                    <a className='logo-youtube' href="https://www.youtube.com/watch?v=PdbsnGuduvo&list=RDPdbsnGuduvo&start_radio=1">
                        <FaYoutube />
                    </a>
                    <a className='logo-facebook' href='https://www.facebook.com/fb1373274059710907'>
                        <FaFacebook />
                    </a>
                </div>
            </div>
        </div>
    )
}
