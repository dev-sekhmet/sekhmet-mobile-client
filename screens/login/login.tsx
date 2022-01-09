import React, { useState, useEffect } from 'react';
import LoginModal from './login-modal';
import {login} from "../../shared/api/authentifiaction-api";

export const Login = (props: any) => {
  const [loginError, setLoginError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {navigation} = props;
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogin = (username:string, password:string, rememberMe = false) => login(username, password, rememberMe);

  const handleClose = () => {
    setShowModal(false);
    navigation.navigate('/');
  };
  return <LoginModal showModal={showModal} handleLogin={handleLogin} handleClose={handleClose} loginError={loginError} />;
};

export default Login;
