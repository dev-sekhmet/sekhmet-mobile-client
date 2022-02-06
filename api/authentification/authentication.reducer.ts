import {AxiosResponse} from 'axios';
import {axiosInstance} from "../axios-config";
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {serializeAxiosError} from '../reducer.utils';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AppThunk} from '../store';
import {setLocale} from '../locale';
import {IStartPhoneVerificationRequest} from "../../model/login/start-phone-verification-request.model";
import qs from 'qs';
import {ICheckPhoneVerificationRequest} from "../../model/login/check-phone-verification-request.model";

export const AUTH_TOKEN_KEY = 'jhi-authenticationToken';
const ON_BOARDING = '@onBoarding';
export const setupAxiosInterceptors = (onUnauthenticated) => {
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
    axiosInstance.interceptors.request.use(onRequestSuccess);
    axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);
};

export const initialState = {
    loading: false,
    isAuthenticated: false,
    loginSuccess: false,
    startVerificationSuccess: false,
    loginError: false, // Errors returned from server side
    startVerificationError: false, // Errors returned from server side
    showModalLogin: false,
    onBoardingFinish: false,
    account: {} as any,
    errorMessage: null as unknown as string, // Errors returned from server side
    startVerificationMessage: null as unknown as string, // Errors returned from server side
    redirectMessage: null as unknown as string,
    sessionHasBeenFetched: false,
    logoutUrl: null as unknown as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession = (): AppThunk => async (dispatch, getState) => {
    await dispatch(getAccount());

    const {account} = getState().authentification;
    if (account && account.langKey) {
        const langKey = await AsyncStorage.getItem('locale') || account.langKey;
        dispatch(setLocale(langKey));
    }
};

export const getAccount = createAsyncThunk('authentication/get_account', async () => axiosInstance.get<any>('/account'), {
    serializeError: serializeAxiosError,
});

export const startVerification = createAsyncThunk(
    'authentication/startVerification',
    async (request: IStartPhoneVerificationRequest) => {
        const requestUrl = `/login?${qs.stringify(request)}`;
        return axiosInstance.get<any>(requestUrl)
    }
);

export const authenticate = createAsyncThunk(
    'authentication/login',
    async (request: ICheckPhoneVerificationRequest) => {
        const requestUrl = `/verify?${qs.stringify(request)}`;
        return axiosInstance.get<any>(requestUrl)
    }
);

export const checkVerification: (request: ICheckPhoneVerificationRequest) => AppThunk =
    (request: ICheckPhoneVerificationRequest) =>
        async dispatch => {
            const result = await dispatch(authenticate(request));
            const response = result.payload as AxiosResponse;
            const bearerToken = response?.headers?.authorization;
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                const jwt = bearerToken.slice(7, bearerToken.length);
                console.log("jwt ", jwt);
                AsyncStorage.setItem(AUTH_TOKEN_KEY, jwt);
            }
            dispatch(getSession());
        };

export const clearAuthToken = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
        return true;
    } catch (exception) {
        return false;
    }
};

export const logout: () => AppThunk = () => dispatch => {
    clearAuthToken();
    dispatch(logoutSession());
};

export const clearAuthentication = messageKey => dispatch => {
    clearAuthToken();
    dispatch(authError(messageKey));
    dispatch(clearAuth());
};

export const onBoardFinished = () => async dispatch => {
    await AsyncStorage.setItem(ON_BOARDING, 'true');
    dispatch(onBoardSuccess());
};

export const getOnBoarding = () => async dispatch => {
    const onBoarding = await AsyncStorage.getItem(ON_BOARDING);
    console.log('onBoarding', onBoarding)
    if(onBoarding) {
        dispatch(onBoardSuccess());
    } else {
        dispatch(onBoardFailure());
    }
};

export const AuthenticationSlice = createSlice({
    name: 'authentication',
    initialState: initialState as AuthenticationState,
    reducers: {
        logoutSession() {
            return {
                ...initialState,
                showModalLogin: true,
            };
        },
        authError(state, action) {
            return {
                ...state,
                showModalLogin: true,
                redirectMessage: action.payload,
            };
        },
        clearAuth(state) {
            return {
                ...state,
                loading: false,
                showModalLogin: true,
                isAuthenticated: false,
            };
        },
        onBoardSuccess(state) {
            return {
                ...state,
                onBoardingFinish: true
            };
        },
        onBoardFailure(state) {
            return {
                ...state,
                onBoardingFinish: false
            };
        },
    },
    extraReducers(builder) {
        builder
            .addCase(authenticate.rejected, (state, action) => ({
                ...initialState,
                errorMessage: action.error.message,
                showModalLogin: true,
                loginError: true,
            }))
            .addCase(authenticate.fulfilled, state => ({
                ...state,
                loading: false,
                loginError: false,
                showModalLogin: false,
                loginSuccess: true,
            }))
            .addCase(startVerification.fulfilled, state => ({
                ...state,
                startVerificationSuccess: true,
                startVerificationError: false,
            }))
            .addCase(getAccount.rejected, (state, action) =>
            {
                console.log('action.error', action.error);
                ({
                    ...state,
                    loading: false,
                    isAuthenticated: false,
                    sessionHasBeenFetched: true,
                    showModalLogin: true,
                    errorMessage: action.error.message,
                })
            })
            .addCase(startVerification.rejected, (state, action) => {

                  console.log('state', state);
                  console.log('action', action);
                    ({
                        ...state,
                        startVerificationSuccess: false,
                        startVerificationError: true
                    })
                }
            )
            .addCase(getAccount.fulfilled, (state, action) => {
                const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
                console.log('action.payload.data', action.payload.data)
                return {
                    ...state,
                    isAuthenticated,
                    loading: false,
                    sessionHasBeenFetched: true,
                    account: action.payload.data,
                };
            })
            .addCase(authenticate.pending, state => {
                state.loading = true;
            })
            .addCase(getAccount.pending, state => {
                state.loading = true;
            });
    },
});

export const {logoutSession, authError, clearAuth, onBoardSuccess, onBoardFailure} = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
