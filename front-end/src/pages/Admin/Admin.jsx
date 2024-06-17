// import React from 'react';
// import HeaderSystem from '../../components/HeaderSystem/HeaderSystem';
// import "./admin.scss";


// function Admin() {
//   return (
//     <div className='Admin-page'>
//       <div className='header'>
//         <HeaderSystem />
//       </div>
//     </div>
//   )
// }
// export default Admin;

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import HeaderSystemAdmin from '../../components/HeaderSystem/HeaderSystemAdmin';
import "./admin.scss";

function Admin() {
  return (
    <div className='Admin-page'>
      <div className='header'>
        <HeaderSystemAdmin />
        <nav>
          <Link to="/admin/system/user-manage"></Link>
        </nav>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;


