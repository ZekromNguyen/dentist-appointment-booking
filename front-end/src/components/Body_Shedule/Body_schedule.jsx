import React from 'react';
import './body_schedule.scss';
import imgbacsi from '../../assets/picture/picture_body_schedule/img_bacsi.png';
import { useNavigate } from 'react-router';

export default function Body_schedule() {
    const navigate = useNavigate();

    const handleBookingClick = () => {
        navigate('/booking');
    };

    return (
        <div className='body_schedule'>
            <div className='schedule_header'>
                <div className='header-title'><h1>PROFESSIONAL MEDICAL TREATMENT</h1></div>
                <div className='header-detail'><h4>Placing your trust in us is the right choice</h4></div>
            </div>
            <div className='schedule_content'>
                <div className='content-left'>
                    <div className='content-header'>We will take care of</div>
                    <div className='content-title'>YOUR HEALTH</div>
                    <div className='content-slogan'>with all our compassionate hearts</div>
                    <div className='content-detail'>High-quality medical team from around the world</div>
                    <button className='btn-booking' onClick={() => handleBookingClick()}>
                        Book an Appointment
                    </button>
                </div>
                <div className='content-right'>
                    <div className='right'>
                        <div className='img'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
