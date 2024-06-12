// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { verifyEmail } from '../../Service/userService'; // Import verifyEmail

// const VerifyEmailPage = () => {
//     const location = useLocation();
//     const token = new URLSearchParams(location.search).get('token');

//     useEffect(() => {
//         const fetchVerifyEmail = async () => {
//             try {
//                 const response = await verifyEmail(token);
//                 console.log(response.data); // In thông báo xác nhận email từ response
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchVerifyEmail();
//     }, [token]);

//     return (
//         <div>
//             <h1>Email verification</h1>
//             {/* Thêm giao diện hoặc thông báo tùy ý */}
//         </div>
//     );
// };

// export default VerifyEmailPage;
