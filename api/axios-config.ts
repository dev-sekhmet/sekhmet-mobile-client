import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://cf72-2a01-e34-ec13-f440-a0c8-18c6-a35a-d1b4.ngrok.io/api',
    timeout: TIMEOUT
});
