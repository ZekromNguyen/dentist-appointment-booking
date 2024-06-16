// import actionTypes from '../actions/actionTypes';

// const initialState = {
//     isLoggedIn: false,
//     adminInfo: null
// }

// const appReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case actionTypes.ADMIN_LOGIN_SUCCESS:
//             return {
//                 ...state,
//                 isLoggedIn: true,
//                 adminInfo: action.adminInfo
//             }
//         case actionTypes.ADMIN_LOGIN_FAIL:
//             return {
//                 ...state,
//                 isLoggedIn: false,
//                 adminInfo: null
//             }
//         case actionTypes.PROCESS_LOGOUT:
//             return {
//                 ...state,
//                 isLoggedIn: false,
//                 adminInfo: null
//             }
//         default:
//             return state;
//     }
// }

// export default appReducer;

const initialState = {
    isLoggedIn: false,
    userRole: null,
    loginError: null
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_ROLE':
            return {
                ...state,
                userRole: action.userRole
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                loginError: null
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isLoggedIn: false,
                loginError: 'Invalid username or password'
            };
        default:
            return state;
    }
};

export default adminReducer;
