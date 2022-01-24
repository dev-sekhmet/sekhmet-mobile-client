import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import AppContext from "./components/AppContext";
import {useState} from "react";
import {Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalPortal } from 'react-native-modals';
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [onBoarding, setOnBoarding] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  //When user complete successfully the login process
    // save the data in storage and update AppContext
  const handleLogin = async () => {
    setLogin(true);
  }

  //Delete all user data and log it out
  const handleLogout = async () => {

  }

  //update context and set onBoarding to completed
  const onDoneOnBoarding = async () => {
    // Alert.alert("Hey success", "Everithing done !");
    try {
      const saved = await AsyncStorage.setItem('@onBoarding', 'true');
      console.log("Saved successfully",saved);
      setOnBoarding(true);
    }catch (e) {
      console.log("Here is the error: ", e);
    }
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AppContext.Provider value={{
        onBoarding: onBoarding,
        user: user,
        login: login,
        handleLogout: handleLogout,
        handleLogin: handleLogin
      }}>

      <SafeAreaProvider>
        <ActionSheetProvider>
        <Navigation colorScheme={colorScheme} doneOnBoarding={onDoneOnBoarding} handleLogin={handleLogin} handleLogout={handleLogout} />
        </ActionSheetProvider>
        <StatusBar />
        <ModalPortal/>
      </SafeAreaProvider>
      </AppContext.Provider>
    );
  }
}
