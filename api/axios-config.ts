import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://a20b-2a01-e34-ec13-f440-5c2e-aca0-b5bd-c443.ngrok.io/api',
    timeout: TIMEOUT
});
