import React, {useState, useEffect} from 'react';
import {Text, View} from "../../components/Themed";

export const Account = (props: any) => {
  const [loginError, setLoginError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {navigation} = props;
  useEffect(() => {
    setShowModal(true);
  }, []);

  return <View>
    <Text>ACCOUNT</Text>
  </View>;
};

export default Account;
