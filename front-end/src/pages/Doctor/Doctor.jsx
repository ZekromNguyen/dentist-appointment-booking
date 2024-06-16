import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import HeaderSystemDoctor from '../../components/HeaderSystem/HeaderSystemDoctor';



function Doctor() {
  return (
    <div className='Admin-page'>
      <div className='header'>
        <HeaderSystemDoctor />
        <nav>
          <Link to="/doctor/system/manage-schedule"></Link>
        </nav>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default Doctor;