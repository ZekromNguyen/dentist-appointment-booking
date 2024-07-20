import React from 'react';
import './body_youtube.scss';

export default function Body_Youtube() {
    return (
        <div className='body_youtube'>
            <div className='youtube-header'>Thông tin về Booking Clinic</div>
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
                    <div className='right-title'>Đặt lịch dễ dàng</div>
                    <div className='right-content'>
                        Bằng cách sử dụng các dịch vụ đặt lịch trực tuyến, bạn có thể quản lý thời gian hiệu quả hơn, đồng thời tạo sự tiện lợi và chuyên nghiệp cho những người liên hệ với bạn. Hãy thử nghiệm và tìm ra cách thức phù hợp nhất với nhu cầu của bạn
                    </div>
                </div>
            </div>
        </div>

    )
}
