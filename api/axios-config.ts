import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://1248-2a01-e34-ec13-f440-d4c7-e0ac-8b7e-9516.ngrok.io/api',
    timeout: TIMEOUT
});
