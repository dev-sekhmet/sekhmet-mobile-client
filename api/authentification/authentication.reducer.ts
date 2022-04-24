import {AxiosResponse} from 'axios';
import {axiosInstance} from "../axios-config";
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {serializeAxiosError} from '../reducer.utils';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AppDispatch, AppThunk} from '../store';
import {setLocale} from '../locale';
import {IStartPhoneVerificationRequest} from "../../model/login/start-phone-verification-request.model";
import qs from 'qs';
import {ICheckPhoneVerificationRequest} from "../../model/login/check-phone-verification-request.model";

export const AUTH_TOKEN_KEY = 'jhi-authenticationToken';
export const TWILIO_TOKEN_KEY = 'twilio_authorization';
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
    refreshSuccess: false,
    loginError: false, // Errors returned from server side
    startVerificationError: false, // Errors returned from server side
    onBoardingFinish: false,
    account: {} as any,
    errorMessage: null as unknown as string, // Errors returned from server side
    startVerificationMessage: null as unknown as string, // Errors returned from server side
    redirectMessage: null as unknown as string,
    sessionHasBeenFetched: false,
    logoutUrl: null as unknown as string,
    twilioToken: null as unknown as string,
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
export const refreshTwilioTokenApi = createAsyncThunk(
    'authentication/refresh-twilio-token',
    async (request: ICheckPhoneVerificationRequest) => {
        const requestUrl = `/refresh-twilio-token?${qs.stringify(request)}`;
        return axiosInstance.get<any>(requestUrl)
    }
);

function extractTokenAndGetUser<R>(result, dispatch: AppDispatch) {
    const response = result.payload as AxiosResponse;
    const bearerToken = response?.headers?.authorization;
    const twilioToken = response?.headers[TWILIO_TOKEN_KEY];

    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwt = bearerToken.slice(7, bearerToken.length);
        AsyncStorage.setItem(AUTH_TOKEN_KEY, jwt);
        AsyncStorage.setItem(TWILIO_TOKEN_KEY, twilioToken);
    }
    dispatch(getSession());
}

export const checkVerification: (request: ICheckPhoneVerificationRequest) => AppThunk =
    (request: ICheckPhoneVerificationRequest) =>
        async dispatch => {
            const result = await dispatch(authenticate(request));
            extractTokenAndGetUser(result, dispatch);
        };

export const refreshTwilioToken: (request: ICheckPhoneVerificationRequest) => AppThunk =
    (request: ICheckPhoneVerificationRequest) =>
        async dispatch => {
            console.log("A refreshingTwilioToken............");
            const result = await dispatch(refreshTwilioTokenApi(request));
            extractTokenAndGetUser(result, dispatch);
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
    if (onBoarding) {
        dispatch(onBoardSuccess());
    } else {
        dispatch(onBoardFailure());
    }
};

export const getTwilioToken = () => async dispatch => {
    const twilioToken = await AsyncStorage.getItem(TWILIO_TOKEN_KEY);
    if (twilioToken) {
        dispatch(onGetTwilioToken(twilioToken));
    }
};
export const onRefreshSuccess = () => async dispatch => {
        dispatch(resetRefreshSuccess());
};

export const AuthenticationSlice = createSlice({
    name: 'authentication',
    initialState: initialState as AuthenticationState,
    reducers: {
        resetStartVerification(state) {
            return {
                ...state,
                startVerificationSuccess: false,
                startVerificationError: false
            };
        },
        resetAuthentication(state) {
            return {
                ...state,
                loginError: false,
                startVerificationSuccess: false,
                startVerificationError: false
            };
        },
        resetRefreshSuccess(state) {
            return {
                ...state,
                refreshSuccess: false
            };
        },
        logoutSession() {
            return {
                ...initialState,
                onBoardingFinish: true
            };
        },
        authError(state, action) {
            return {
                ...state,
                redirectMessage: action.payload,
            };
        },
        clearAuth(state) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
            };
        },
        onBoardSuccess(state) {
            return {
                ...state,
                onBoardingFinish: true
            };
        },
        onGetTwilioToken(state, action) {
            return {
                ...state,
                twilioToken: action.payload
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
            .addCase(authenticate.rejected, (state, action) => {
                state.errorMessage = action.error.message;
                state.loginError = true;
            })
            .addCase(authenticate.fulfilled, (state, action) => ({
                ...state,
                loading: false,
                loginError: false,
                loginSuccess: true,
                twilioToken: action.payload.data.twilio_token
            }))
            .addCase(refreshTwilioTokenApi.fulfilled, (state, action) => {

                    const newVar = {
                        ...state,
                        loading: false,
                        loginError: false,
                        loginSuccess: true,
                        refreshSuccess: true,
                        twilioToken: action.payload.data.twilio_token
                    };
                    // console.log("newVar", newVar);
                    return newVar
                }
            )
            .addCase(startVerification.fulfilled, state => {
                state.startVerificationSuccess = true;
                state.startVerificationError = false;
            })
            .addCase(getAccount.rejected, (state, action) => {
                ({
                    ...state,
                    loading: false,
                    isAuthenticated: false,
                    sessionHasBeenFetched: true,
                    errorMessage: action.error.message,
                })
            })
            .addCase(startVerification.rejected, state => {
                    state.startVerificationSuccess = false;
                    state.startVerificationError = true;
                }
            )
            .addCase(getAccount.fulfilled, (state, action) => {
                const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
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

export const {
    logoutSession,
    authError,
    clearAuth,
    onBoardSuccess,
    onGetTwilioToken,
    onBoardFailure,
    resetAuthentication,
    resetRefreshSuccess,
    resetStartVerification
} = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
