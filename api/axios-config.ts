import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://f77f-2a01-e34-ec13-f440-55fa-dd7e-1fc6-6396.ngrok.io/api',
    timeout: TIMEOUT
});
