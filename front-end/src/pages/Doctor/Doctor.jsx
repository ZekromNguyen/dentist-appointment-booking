import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import HeaderSystemDoctor from '../../components/HeaderSystem/HeaderSystemDoctor';
import ManageDentist from './ManageDentist';

function Doctor() {
  const location = useLocation();
  const isManageSchedule = location.pathname === '/doctor/system/manage-schedule';

  return (
    <div className='Admin-page'>
      <div className='header'>
        <HeaderSystemDoctor />
      </div>
      <div>
        {  isManageSchedule  }
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default Doctor;
