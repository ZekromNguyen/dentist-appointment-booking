import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import img1 from "../../assets/picture/picture_body_slider/img_baonam.png";
import img2 from "../../assets/picture/picture_body_slider/img_hoaianh.png";
import img3 from "../../assets/picture/picture_body_slider/img_kim.jpg";
import img4 from "../../assets/picture/picture_body_slider/img_maris.png";
import img5 from "../../assets/picture/picture_body_slider/img_tritam.png";
import img6 from "../../assets/picture/picture_body_slider/img_vinhlong.png";
import './body_Slider.scss'; 
export default function BodySlider() {
    return (
        <div className="body-slider">
            <div className='body-slider-header'>
                <span className='title'>Cơ sở nổi bật</span>
                <button className='btn-title'>Xem thêm</button>
            </div>
            <div className='body-slider-content'>
                <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{delay:2000}}
                    breakpoints={{
                        1024: { slidesPerView: 4 },
                        600: { slidesPerView: 2 },
                        480: { slidesPerView: 1 },
                    }}
                >
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img1})` }}></div>
                        <div className='text'>Nha khoa Bảo Nam</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img2})` }}></div>
                        <div className='text'>Nha khoa Hoài Anh</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img3})` }}></div>
                        <div className='text'>Nha khoa Kim</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img4})` }}></div>
                        <div className='text'>Nha khoa Maris</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img5})` }}></div>
                        <div className='text'>Nha khoa Trí Tâm</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='img_slider' style={{ backgroundImage: `url(${img6})` }}></div>
                        <div className='text'>Nha khoa Vĩnh Long</div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
}

