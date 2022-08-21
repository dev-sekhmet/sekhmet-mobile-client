import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://8234-2a01-e34-ec13-f440-2d7a-cbb0-9ace-a5d5.ngrok.io/api',
    timeout: TIMEOUT
});
