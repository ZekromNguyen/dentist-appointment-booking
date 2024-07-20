// import React from 'react';
import "./home.scss";
// import Container from 'react-bootstrap/Container';
// import { Row } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import Body_Infor from '../../components/Body_Infor/Body_Infor';
import Body_Slider from '../../components/Body_Slider/Body_Slider';
import Body_Doctors from '../../components/Body_Doctors/Body_Doctors';
import Body_Service from '../../components/Body_Service/Body_Service';
import Body_schedule from '../../components/Body_Shedule/Body_schedule';
import Body_Youtube from '../../components/Body_Youtube/Body_Youtube';
import Footer from '../../components/Footer/Footer';


export default function Home() {
    return (
        <div className="All_Home">
            <div className="home-header-container">
                <div className="header-content"> <Header /></div>
            </div>
            <div className="home-banner">
                <div><Banner /></div>
            </div>
            <div className="home-body-infor">
                <div><Body_Infor /></div>
            </div>
            <div className="home-body-slider">
                <div><Body_Slider /></div>
            </div>
            <div className='home-body-doctors'>
                <div><Body_Doctors /></div>
            </div>
            <div className='home-body-service'>
                <div><Body_Service /></div>
            </div>
            <div className='home-body-schedule'>
                <div><Body_schedule /></div>
            </div>
            <div className='home-body-youtube'>
                <div><Body_Youtube /></div>
            </div>
            <div className='home-footer'>
                <div><Footer /></div>
            </div>
        </div>
    )
}
