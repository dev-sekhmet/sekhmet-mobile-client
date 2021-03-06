import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://3006-2a01-e34-ec13-f440-510a-f58d-69a0-fea6.ngrok.io/api',
    timeout: TIMEOUT
});
