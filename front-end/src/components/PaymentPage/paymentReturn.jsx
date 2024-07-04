import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VNPayReturnPage = () => {
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSuccess = params.get('vnp_ResponseCode') === '00';

    if (isSuccess) {
      alert('Payment successful!'); // Thông báo thanh toán thành công
      window.location.href = "/success";
    } else {
      alert('Payment failed!'); // Thông báo thanh toán thất bại
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
