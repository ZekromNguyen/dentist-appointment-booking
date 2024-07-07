import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VNPayReturnPage = () => {
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSuccess = params.get('vnp_ResponseCode') === '00';


    if (isSuccess) {
      window.location.href = "/success";
    } else {
      window.location.href = "/failure";
    }
  }, [location.search]);

  return (
    <div>
      <h2>Processing Payment...</h2>
      {/* Có thể hiển thị thông tin đang xử lý */}
    </div>
  );
};

export default VNPayReturnPage;
