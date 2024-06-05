import React from 'react';
import './body_infor.scss';

export default function Body_Infor() {
    return (
        <div className="information">
            <div className="infor-title">Dành cho bạn</div>
            <div className="infor-detail">
                <div className="detail_baiviet">
                    <img className='img_baiviet' src='/img_baiviet.png'></img>
                    <div className='text_baiviet'>Bài viết</div>
                </div>
                <div className="detail_coso">
                    <img className='img_coso' src='/img_coso.png'></img>
                    <div className='text_coso'>Cơ sở</div>
                </div>
            </div>
        </div>
    )
}
