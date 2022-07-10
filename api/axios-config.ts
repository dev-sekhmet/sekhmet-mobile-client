import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://e0c4-2a01-e34-ec13-f440-4122-fb57-489b-3324.ngrok.io/api',
    timeout: TIMEOUT
});
