// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home/Home';
// import Login from './components/Login/Login';
// import Register from './components/Register/Register';
// import LoginDentist from './components/LoginDentist/LoginDentist';
// import ForgotPassword from './components/ForgotPassword/ForgotPassword';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // import VerifyEmailPage from './components/ForgotPassword/VerifyEmailPage';
// import ResetPassword from './components/ForgotPassword/ResetPassword';
// import Admin from './pages/Admin/Admin';
// import UserManage from './System/UserManage';


// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/loginDentist" element={<LoginDentist />} />
//           <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
//           {/* <Route path="/VerifyEmailPage" element={<VerifyEmailPage />}></Route> */}
//           <Route path="/ResetPassword" element={<ResetPassword />}></Route>
//           <Route path="/Admin" element={<Admin />}></Route>
//           <Route path="system/user-manage" element={UserManage} />
//           <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />

//         </Routes>
//       </div>
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </Router>
//   );
// }

// export default App;

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
import Admin from './pages/Admin/Admin';
import System from './routes/System';
import Doctor from './pages/Doctor/Doctor';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/loginDentist" element={<LoginDentist />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />

          <Route path="/admin/*" element={<Admin />}>
            <Route path="system/*" element={<System />} />
          </Route>
          <Route path="/doctor/*" element={<Doctor />}>
            <Route path="system/*" element={<System />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
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