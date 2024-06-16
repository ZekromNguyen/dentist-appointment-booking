// export * from './appActions'
// export * from './adminActions'
// export * from './userActions'

export const setUserRole = (userRole) => {
    return {
        type: 'SET_USER_ROLE',
        userRole
    };
};

export const loginSuccess = () => {
    return {
        type: 'LOGIN_SUCCESS'
    };
};

export const loginFailure = () => {
    return {
        type: 'LOGIN_FAILURE'
    };
};
