// import React from 'react'
// import './body_doctors.scss';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import { NextArrow, PrevArrow } from "./Arrow-Doctor"; // Import các nút tùy chỉnh

// export default function Body_Doctors() {
//     let settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 5,
//         slidesToScroll: 1,
//         nextArrow: < NextArrow />,
//         prevArrow: <PrevArrow />
//     }
//     return (
//         <div>
//             <div className='slider-doctors'>
//                 <div className='header-doctor'>
//                     <span className='header-title'>Bác sĩ nổi bật</span>
//                     <button className='btn-doctors'>Xem thêm</button>
//                 </div>
//                 <Slider {...settings}>
//                     <div className="img">
//                         <a className='img_slider' href="dentistDetail"></a>
//                         <div className='text'>Bác sĩ Nam</div>

//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-1' ></div>
//                         <div className='text'>Bác sĩ Hà</div>

//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-2'></div>
//                         <div className='text'>Bác sĩ Tiến</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-3'></div>
//                         <div className='text'>Bác sĩ Hùng</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-4'></div>
//                         <div className='text'>Bác sĩ Duyên</div>
//                     </div>
//                     <div className='img'>
//                         <div className='img_slider-5'></div>
//                         <div className='text'>Bác sĩ Thịnh</div>
//                     </div>
//                 </Slider>
//             </div>
//         </div>
//     )
// }


// import React, { useEffect, useState } from 'react';
// import './body_doctors.scss';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import { NextArrow, PrevArrow } from "./Arrow-Doctor";
// import axios from 'axios';

// export default function Body_Doctors() {
//     const [dentists, setDentists] = useState([]);

//     useEffect(() => {
//         fetchDentists();
//     }, []);

//     const fetchDentists = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/handleGetAllDentist?DentistID=ALL'); // Replace with your backend API endpoint
//             if (response.data && Array.isArray(response.data)) {
//                 setDentists(response.data); // Ensure dentists is set to an array
//             } else {
//                 console.error('Invalid data format received:', response.data);
//             }
//         } catch (error) {
//             console.error('Error fetching dentists:', error);
//         }
//     };

//     let settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 5,
//         slidesToScroll: 1,
//         nextArrow: <NextArrow />,
//         prevArrow: <PrevArrow />
//     };

//     const handleDoctorClick = (dentistId) => {
//         // Handle click event
//         console.log('Doctor clicked:', dentistId);
//     };

//     return (
//         <div className='slider-doctors'>
//             <div className='header-doctor'>
//                 <span className='header-title'>Bác sĩ nổi bật</span>
//                 <button className='btn-doctors'>Xem thêm</button>
//             </div>
//             <Slider {...settings}>
//                 {dentists.map((dentist, index) => (
//                     <div key={index} className="img" onClick={() => handleDoctorClick(dentist.DentistID)}>
//                         <div className={`img_slider img_slider-${index}`}></div>
//                         <div className='text'>{dentist.DentistName}</div>
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import './body_doctors.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { NextArrow, PrevArrow } from "./Arrow-Doctor";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../ServiceSystem/axios';

export default function Body_Doctors() {
    const [dentists, setDentists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDentists();
    }, []);

    const fetchDentists = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/handleGetAllDentist?DentistID=ALL`);
            if (response.data && Array.isArray(response.data.account)) {
                setDentists(response.data.account);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error('Error fetching dentists:', error);
        }
    };

    const handleDoctorClick = (dentistId) => {
        const dentist = dentists.find(d => d.DentistID === dentistId);
        if (dentist) {
            navigate(`/dentistDetail/${dentistId}`, { state: { dentist } });
        }
    };

    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <div className='slider-doctors'>
            <div className='header-doctor'>
                <span className='header-title'>Bác sĩ nổi bật</span>
                <button className='btn-doctors'>Xem thêm</button>
            </div>
            <Slider {...settings}>
                {dentists.map((dentist, index) => (
                    <div key={index} className="img" onClick={() => handleDoctorClick(dentist.DentistID)}>
                        <img
                            src={`${BASE_URL}/${dentist.ImagePath}`}
                            alt={dentist.DentistName}
                            className={`img_slider img_slider-${index}`}
                        />
                        <div className='text'>{dentist.DentistName}</div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
