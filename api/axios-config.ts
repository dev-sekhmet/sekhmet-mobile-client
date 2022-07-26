import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://f668-2a01-e34-ec13-f440-7531-e249-a0be-caf3.ngrok.io/api',
    timeout: TIMEOUT
});
