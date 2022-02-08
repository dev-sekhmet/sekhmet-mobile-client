import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification/authentication.reducer";

const TIMEOUT = 60 * 1000;
export const axiosInstance = axios.create({
    baseURL: 'http://app-prod.eba-gidg9c2p.eu-west-3.elasticbeanstalk.com/api',
    timeout: TIMEOUT
});
