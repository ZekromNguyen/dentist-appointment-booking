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
import './body_Slider.scss'; // Cần có file CSS/SCSS để định dạng các style cho Swiper và các thành phần trong đó
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



// import React from 'react';
// // import Swiper core and required modules
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';
// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';


// import img1 from "../../assets/picture/picture_body_slider/img_baonam.png";
// import img2 from "../../assets/picture/picture_body_slider/img_hoaianh.png";
// import img3 from "../../assets/picture/picture_body_slider/img_kim.jpg";
// import img4 from "../../assets/picture/picture_body_slider/img_maris.png";
// import img5 from "../../assets/picture/picture_body_slider/img_tritam.png";
// import img6 from "../../assets/picture/picture_body_slider/img_vinhlong.png";

// export default function BodySlider() {
//     return (
//         <div className="body-slider">
//             <div className='body-slider-header'>
//                 <span className='title'>Cơ sơ nổi bật</span>
//                 <button className='btn-title'>Xem thêm</button>
//             </div>
//             <div className='body-slider-content'>
//                 <Swiper
//                     spaceBetween={50}
//                     slidesPerView={4}
//                     autoplay={{ delay: 5000 }}
//                     loop={true}
//                     breakpoints={{
//                         1024: {
//                             slidesPerView: 4,
//                         },
//                         600: {
//                             slidesPerView: 2,
//                         },
//                         480: {
//                             slidesPerView: 1,
//                         },
//                     }}
//                 >
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img1})` }}></div>
//                         <div className='text'>Nha khoa Bảo Nam</div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img2})` }}></div>
//                         <div className='text'>Nha khoa Hoài Anh</div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img3})` }}></div>
//                         <div className='text'>Nha khoa Kim</div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img4})` }}></div>
//                         <div className='text'>Nha khoa Maris</div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img5})` }}></div>
//                         <div className='text'>Nha khoa Trí Tâm</div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className='img_slider' style={{ backgroundImage: `url(${img6})` }}></div>
//                         <div className='text'>Nha khoa Vĩnh Long</div>
//                     </SwiperSlide>
//                 </Swiper>
//             </div>
//         </div>
//     );
// }


// import React from 'react';
// import './body_Slider.scss';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// import { NextArrow, PrevArrow } from "./ArrowSlider.jsx"; // Import các nút tùy chỉnh
// import img1 from "../../assets/picture/picture_body_slider/img_baonam.png";
// import img2 from "../../assets/picture/picture_body_slider/img_hoaianh.png";
// import img3 from "../../assets/picture/picture_body_slider/img_kim.jpg";
// import img4 from "../../assets/picture/picture_body_slider/img_maris.png";
// import img5 from "../../assets/picture/picture_body_slider/img_tritam.png";
// import img6 from "../../assets/picture/picture_body_slider/img_vinhlong.png";


// export default function Body_Slider() {
//     let settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         nextArrow: < NextArrow />,
//         prevArrow: <PrevArrow />
//     };
//     return (
//         <div className="body-slider">
//             <div className='body-slider-header'>
//                 <span className='title'>Cơ sơ nổi bật</span>
//                 <button className='btn-title'>Xem thêm</button>
//             </div>
//             <div className='body-slider-content'>
//                 <Slider {...settings}>
//                     <div className="img">
//                         <div className='img_slider'></div>
//                         <div className='text'>Nha khoa Bảo Nam</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-1' ></div>
//                         <div className='text'>Nha khoa Hoài Anh</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-2'></div>
//                         <div className='text'>Nha khoa Kim</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-3'></div>
//                         <div className='text'>Nha khoa Maris</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-4'></div>
//                         <div className='text'>Nha khoa Trí Tâm</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-5'></div>
//                         <div className='text'>Nha khoa Vĩnh Long</div>
//                     </div>
//                 </Slider>
//             </div>
//         </div>
//     )
// }
