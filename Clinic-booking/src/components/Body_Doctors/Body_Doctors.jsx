import React from 'react'
import './body_doctors.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { NextArrow, PrevArrow } from "./Arrow-Doctor"; // Import các nút tùy chỉnh

export default function Body_Doctors() {
    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: < NextArrow />,
        prevArrow: <PrevArrow />
    }
    return (
        <div>
            <div className='slider-doctors'>
                <div className='header-doctor'>
                    <span className='header-title'>Bác sĩ nổi bật</span>
                    <button className='btn-doctors'>Xem thêm</button>
                </div>
                <Slider {...settings}>
                    <div className="img">
                        <div className='img_slider'></div>
                        <div className='text'>Bác sĩ Nam</div>

                    </div>
                    <div className='img'>
                        <div className='img_slider-1' ></div>
                        <div className='text'>Bác sĩ Hà</div>

                    </div>
                    <div className='img'>
                        <div className='img_slider-2'></div>
                        <div className='text'>Bác sĩ Tiến</div>
                    </div>
                    <div className='img'>
                        <div className='img_slider-3'></div>
                        <div className='text'>Bác sĩ Hùng</div>
                    </div>
                    <div className='img'>
                        <div className='img_slider-4'></div>
                        <div className='text'>Bác sĩ Duyên</div>
                    </div>
                    <div className='img'>
                        <div className='img_slider-5'></div>
                        <div className='text'>Bác sĩ Thịnh</div>
                    </div>
                </Slider>
            </div>
        </div>
    )
}

