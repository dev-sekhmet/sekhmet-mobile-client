import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://162e-2a01-e34-ec13-f440-ecc7-e1bb-aa3e-ada.ngrok.io/api',
    timeout: TIMEOUT
});
