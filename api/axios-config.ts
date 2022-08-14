import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://8c77-2a01-e34-ec13-f440-b53c-5e59-b4a2-96ef.ngrok.io/api',
    timeout: TIMEOUT
});
