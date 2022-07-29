import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://f39b-2a01-e34-ec13-f440-1960-ed19-2ed8-a5c6.ngrok.io/api',
    timeout: TIMEOUT
});
