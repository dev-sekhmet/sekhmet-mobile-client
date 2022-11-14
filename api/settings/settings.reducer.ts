import {axiosInstance} from "../axios-config";
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSession} from '../authentification/authentication.reducer';
import {AppThunk} from '../store';
import {serializeAxiosError} from '../reducer.utils';

const initialState = {
    loading: false,
    errorMessage: null,
    successMessage: null,
    updateSuccess: false,
    updateFailure: false,

    updateProfilPictureLoading: false,
    updateProfilPictureSuccess: false,
    updateProfilPictureUpdateFailure: false,
};

export type SettingsState = Readonly<typeof initialState>;

// Actions
const apiUrl = '/account';

export const saveAccountSettings: (account: any) => AppThunk = account => async dispatch => {
    await dispatch(updateAccount(account));
    await AsyncStorage.removeItem('locale')
    dispatch(getSession());
};

export const saveProfilPicture: (formdata: any) => AppThunk = formdata => async dispatch => {
    await dispatch(updateProfilPicture(formdata));
    dispatch(getSession());
};

export const updateAccount = createAsyncThunk('settings/update_account',
    async (account: any) => axiosInstance.post<any>(apiUrl, account), {
        serializeError: serializeAxiosError
    });

export const updateProfilPicture = createAsyncThunk('settings/update_user-profil-picture', async (formdata: any) =>
    axiosInstance.post<any>(`${apiUrl}/user-profil-picture`, formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        transformRequest: (d) => d
    }), {
    serializeError: serializeAxiosError,
});

export const SettingsSlice = createSlice({
    name: 'settings',
    initialState: initialState as SettingsState,
    reducers: {
        reset() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(updateAccount.pending, state => {
                state.loading = true;
                state.errorMessage = null;
                state.updateSuccess = false;
            })
            .addCase(updateAccount.rejected, state => {
                state.loading = false;
                state.updateSuccess = false;
                state.updateFailure = true;
            })
            .addCase(updateAccount.fulfilled, state => {
                state.loading = false;
                state.updateSuccess = true;
                state.updateFailure = false;
                state.successMessage = 'settings.messages.success';
            })
            .addCase(updateProfilPicture.pending, state => {
                state.updateProfilPictureLoading = true;
                state.updateProfilPictureSuccess = false;
            })
            .addCase(updateProfilPicture.rejected, state => {
                state.updateProfilPictureLoading = true;
                state.updateProfilPictureSuccess = false;
                state.updateProfilPictureUpdateFailure = true;
            })
            .addCase(updateProfilPicture.fulfilled, state => {
                state.updateProfilPictureLoading = false;
                state.updateProfilPictureSuccess = true;
                state.updateProfilPictureUpdateFailure = false;
            });
    },
});

export const {reset} = SettingsSlice.actions;

// Reducer
export default SettingsSlice.reducer;
