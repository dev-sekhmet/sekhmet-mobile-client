import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://cd9c-2a01-e34-ec13-f440-a9f2-b765-9764-f71a.ngrok.io/api',
    timeout: TIMEOUT
});
