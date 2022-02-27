import {axiosInstance} from "../axios-config";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from '../authentification/authentication.reducer';
import { AppThunk } from '../store';
import { serializeAxiosError } from '../reducer.utils';
import {Conversation} from "@twilio/conversations";

const initialState = {
    loading: false,
    errorMessage: null,
    successMessage: null,
    updateSuccess: false,
    updateFailure: false,
    selectedConversation: null,
};

export type ConversationWriteState = Readonly<typeof initialState>;

// Actions
const apiUrl = '/conversations';

export const findOrCreateConversationDual = createAsyncThunk('conversations/findOrCreateConversationDual', async (id: string) => axiosInstance.get<any>(`${apiUrl}/${id}/user?`), {
    serializeError: serializeAxiosError,
});

export const ConversationWriteStateSlice = createSlice({
    name: 'conversations',
    initialState: initialState as ConversationWriteState,
    reducers: {
        reset() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(findOrCreateConversationDual.pending, state => {
                state.loading = true;
                state.errorMessage = null;
                state.updateSuccess = false;
            })
            .addCase(findOrCreateConversationDual.rejected, state => {
                state.loading = false;
                state.updateSuccess = false;
                state.updateFailure = true;
            })
            .addCase(findOrCreateConversationDual.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                state.updateFailure = false;
                state.selectedConversation = action.payload.data
                state.successMessage = 'settings.messages.success';
            });
    },
});

export const { reset } = ConversationWriteStateSlice.actions;

// Reducer
export default ConversationWriteStateSlice.reducer;
