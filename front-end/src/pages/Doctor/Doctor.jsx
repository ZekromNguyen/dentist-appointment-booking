import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderSystemDoctor from '../../components/HeaderSystem/HeaderSystemDoctor';
import ManageDentist from './ManageDentist';
import SenderList from './SenderList';
import { checkSession } from '../../Service/userService';



function Doctor() {
  const location = useLocation();
  const isManageSchedule = location.pathname === '/doctor/system/manage-schedule';
  const [userAccountId, setUserAccountId] = useState(null);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const customer = await checkSession();
        if (!customer) {
          navigate('/login');
        } else {
          setUserAccountId(customer.id); // Set the logged-in user's accountId
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, [navigate]);

  const handleChatListClick = () => {
    console.log('userAccountId before navigate:', userAccountId); // Log the userAccountId before navigation
    if (!loggedIn) {
      alert('Vui lòng đăng nhập để trò chuyện.');
      return;
    }

    navigate(`/senders/${userAccountId}`);
  }

  return (
    <div className='Admin-page'>
      <div className='header'>
        <HeaderSystemDoctor />
      </div>
      <button className="chat-button" onClick={handleChatListClick}>
        Message
      </button>
      <div>
        {isManageSchedule}
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default Doctor;