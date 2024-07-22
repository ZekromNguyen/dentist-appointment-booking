import React, { useEffect, useState } from 'react';
import './body_Slider.scss';
import { useNavigate } from 'react-router-dom';
import { getAllClinic } from '../../Service/clinicService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import BASE_URL from '../../ServiceSystem/axios';

const BodySlider = () => {
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        try {
            const data = await getAllClinic('ALL');
            console.log('Fetched clinics data:', data);
            if (data && data.account && Array.isArray(data.account)) {
                setClinics(data.account);
            } else {
                console.error('Invalid data format received:', data);
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    };

    const handleClinicClick = (clinicID) => {
        const clinic = clinics.find(c => c.ClinicID === clinicID);
        if (clinic) {
            console.log('Clicked clinic:', clinic); // Log clinic data to check for location information
            navigate(`/clinicDetail/${clinicID}`, { state: { clinic } });
        } else {
            console.error(`Clinic with ID ${clinicID} not found.`);
        }
    };

    return (
        <div className="body-slider">
            <div className='body-slider-header'>
                <span className='title'>Clinic Information</span>
                <button className='btn-title'>See More</button>
            </div>
            <div className='body-slider-content'>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2000 }}
                    breakpoints={{
                        1024: { slidesPerView: 4 },
                        600: { slidesPerView: 2 },
                        480: { slidesPerView: 1 },
                    }}
                >
                    {clinics.map((clinic, index) => (
                        <SwiperSlide key={index} onClick={() => handleClinicClick(clinic.ClinicID)}>
                            <div
                                className='img_slider'
                                style={{ backgroundImage: `url(${BASE_URL}/${clinic.ImagePath})` }}
                            ></div>
                            <div className='text'>{clinic.ClinicName}</div>
                            {console.log(`Clinic ${index} ImagePath:`, clinic.ImagePath)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default BodySlider;
