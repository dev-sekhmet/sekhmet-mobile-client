import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://9a05-2a01-e34-ec13-f440-2907-5b31-c5ec-24eb.ngrok.io/api',
    timeout: TIMEOUT
});
