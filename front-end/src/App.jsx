import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LoginDentist from './components/LoginDentist/LoginDentist';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ForgotPassword/ResetPassword';
import ClinicOwner from './pages/ClinicOwner/ClinicOwner';
import System from './routes/System';
import Doctor from './pages/Doctor/Doctor';
import Booking from './components/Booking/Booking';
import Payment from './components/PaymentPage/Payment';
import BookingHistory from './components/BookingHistory/BookingHistory';
import AdminRoutes from './AdminRoutes/AdminRoutes';
import BookingPage from './components/BookingPage/BookingPage';
import VNPayReturnPage from './components/PaymentPage/paymentReturn';
import SuccessPage from './components/PaymentPage/SuccessPage';
import FailurePage from './components/PaymentPage/FailurePage';
import DoctorLoad from './components/DoctorLoad/DoctorLoad';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import ClinicLoad from './components/Clinic/ClinicLoad';
import Chat from './components/chatbox/chat';
import Body_Youtube from './components/Body_Youtube/Body_Youtube';
import BodySlider from './components/Body_Slider/Body_Slider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import VerifyAccount from './components/verify/VerifyAccount';
import SenderList from './components/chatbox/SenderList';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Info" element={<Body_Youtube />} />
          <Route path="/Clinic" element={<BodySlider />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyAccount />} /> {/* Định tuyến cho VerifyAccount */}
          <Route path="/register" element={<Register />} />
          <Route path="/loginDentist" element={<LoginDentist />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route element={<ProtectedRoute allowedRoles={[1]} />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order/vnpay_return" element={<VNPayReturnPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/failure" element={<FailurePage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/bookinghistory" element={<BookingHistory />} />
            <Route path="/bookingpage" element={<BookingPage />} />
          </Route>


          <Route path="/chat/:senderId/:receiverId" element={<Chat />} />
          {/* profile */}
          <Route path="/profile/:accountId" element={<Profile />} />
          <Route path="/editprofile/:accountId" element={<EditProfile />} />

          <Route element={<ProtectedRoute allowedRoles={[3]} />}>
            <Route path="/ClinicOwner/*" element={<ClinicOwner />}>
              <Route path="system/*" element={<System />} />
            </Route>
          </Route>

          {/* profile */}
          <Route path="/profile/:accountId" element={<Profile />} />
          <Route path="/editprofile/:accountId" element={<EditProfile />} />

          <Route element={<ProtectedRoute allowedRoles={[2]} />}>
            <Route path="/doctor/*" element={<Doctor />}>
              <Route path="system/*" element={<System />} />
            </Route>
          </Route>
          {/* <Route path="dentistDetail" element={<DoctorLoad />}></Route> */}
          <Route path="/dentistDetail/:dentistId" element={<DoctorLoad />} />
          <Route path="/senders/:receiverId" element={<SenderList />} />
          <Route path="/clinicDetail/:clinicID" element={<ClinicLoad />}></Route>
          <Route element={<ProtectedRoute allowedRoles={[4]} />}>
            <Route path="admin/*" element={<AdminRoutes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;