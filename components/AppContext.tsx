import { createContext } from 'react';

const AppContext = createContext({
    onBoarding: false,
    user: {
        firstName: 'TEMATE',
        lastName: 'Gaetan'
    },
    login: false,
    handleLogout: null,
    handleLogin: null
})
export  default AppContext;
