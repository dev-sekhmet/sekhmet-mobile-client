import { createContext } from 'react';

const AppContext = createContext({
    onBoarding: false,
    user: null,
    login: false,
    handleLogout: null,
    handleLogin: null
})
export  default AppContext;
