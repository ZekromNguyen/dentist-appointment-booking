import React from 'react';
import { GoSearch } from "react-icons/go";
import { FaRegHospital } from "react-icons/fa";
import { RiServiceFill } from "react-icons/ri";
import { LiaTeethOpenSolid } from "react-icons/lia";
import { FaUserDoctor } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import "./banner.scss";

const slideStyles = [
    {
        backgroundImage: `
            url('img_header.png'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1)),
            url('img-header1.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1))
        `
    },
    {
        backgroundImage: `
            url('img-9.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1)),
            url('img-header3.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1))
        `
    },
    {
        backgroundImage: `
            url('img-header7.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1)),
            url('img-header4.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1))
        `
    },
    {
        backgroundImage: `
            url('img-header4.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1)),
            url('img-header6.jpg'),
            linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.1))
        `
    },
    // Add more styles if needed
];

export default function Banner() {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
                1024: { slidesPerView: 1 },
                600: { slidesPerView: 1 },
                480: { slidesPerView: 1 },
            }}
        >
            {slideStyles.map((style, index) => (
                <SwiperSlide key={index}>
                    <div className='banner-container' style={{ ...style, height: '500px', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', maxWidth: '1190px', margin: '0 auto', boxSizing: 'border-box', borderRadius: '10px' }}>
                        <div className='header-banner'>
                            <div className='header-Information'>
                                <div className="header-title">Welcome to Clinic Appointment Booking</div>
                                <div className="header-title-content">COMPREHENSIVE & FAST</div>
                                <div className="search">
                                    <i className='div-search'><GoSearch className='icon-search' /></i>
                                    <input className="search-text" type='text' placeholder='Search for the nearest location' />
                                </div>
                            </div>
                            <div className="header-detail">
                                <div className="option-clinic">
                                    <div className="option-child">
                                        <div className='icon-child' style={{ fontSize: '60px', color: 'red' }}><RiServiceFill /></div>
                                        <div className='text-child'>Comprehensive Services</div>
                                    </div>
                                    <div className="option-child">
                                        <div className='icon-child'><LiaTeethOpenSolid className='icon-chuyenkhoa' /></div>
                                        <div className='text-child'>Specialty</div>
                                    </div>
                                    <div className="option-child">
                                        <div className='icon-child'><FaRegHospital className='icon-yte' /></div>
                                        <div className='text-child'>Medical Facility</div>
                                    </div>
                                    <div className="option-child">
                                        <div className='icon-child'><FaUserDoctor className='icon-doctor' /></div>
                                        <div className='text-child'>Doctor</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
