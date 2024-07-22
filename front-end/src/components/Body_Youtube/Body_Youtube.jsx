import React from 'react';
import './body_youtube.scss';

export default function Body_Youtube() {
    return (
        <div className='body_youtube'>
            <div className='youtube-header'>Information about Booking Clinic</div>
            <div className='youtube-body'>
                <div className='body-left'>
                    <iframe width="630" height="1000"
                        src="https://www.youtube.com/embed/xMR3FHymtz4"
                        title="How to Book a Medical Appointment With Your Clinic&#39;s Appointment Booking System (ABS)"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen></iframe>
                </div>

                <div className='body-right'>
                    <div className='right-title'>Easy Booking</div>
                    <div className='right-content'>
                        By using online booking services, you can manage your time more efficiently while providing convenience and professionalism to those who contact you. Experiment and find the method that best suits your needs.
                    </div>
                </div>
            </div>
        </div>
    )
}
