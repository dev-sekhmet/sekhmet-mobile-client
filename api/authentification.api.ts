import axios, {AxiosResponse} from 'axios';
import {IStartPhoneVerificationRequest} from "../model/login/start-phone-verification-request.model";
import {from, Observable} from 'rxjs';
import {axiosInstance} from "./axios-config";
import qs from 'qs';
import { map } from 'rxjs/operators';
import {ICheckPhoneVerificationRequest} from "../model/login/check-phone-verification-request.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_TOKEN_KEY = 'skh-authenticationToken';

export const phoneLogin = (request: IStartPhoneVerificationRequest) : Observable<AxiosResponse<string, IStartPhoneVerificationRequest>> => {
    const requestUrl = `/login?${qs.stringify(request)}`;
    console.log("buildParams: ", requestUrl)
    return from(axiosInstance.get<string>(requestUrl));
};

export const verifyLogin = (request: ICheckPhoneVerificationRequest) : Observable<AxiosResponse<any, ICheckPhoneVerificationRequest>> => {
    const requestUrl = `/verify?${qs.stringify(request)}`;
    console.log("buildParams: ", requestUrl)

    return from(axiosInstance.get<any>(requestUrl)).pipe(map((res) => {
        const bearerToken = res?.headers?.authorization;
        if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
            const jwt = bearerToken.slice(7, bearerToken.length);
            AsyncStorage.setItem(AUTH_TOKEN_KEY, jwt);
        }
        return res;
    } ));
};
