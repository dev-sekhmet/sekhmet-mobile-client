import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "./authentification.api";

const TIMEOUT = 1 * 60 * 1000;
export const axiosInstance = axios.create({ baseURL: 'http://ac88-2a01-e34-ec13-f440-981a-a2f7-c37f-71f.ngrok.io/api', timeout: TIMEOUT });

const setupAxiosInterceptors =  (onUnauthenticated) => {
    const onRequestSuccess = async config => {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    };
    const onResponseSuccess = response => response;
    const onResponseError = err => {
        const status = err.status || (err.response ? err.response.status : 0);
        if (status === 403 || status === 401) {
            onUnauthenticated();
        }
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
