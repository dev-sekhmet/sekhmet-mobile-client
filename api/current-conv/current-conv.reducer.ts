import {createSlice} from "@reduxjs/toolkit";
import {uniq} from "lodash";

const initialState: string = '';

export const CurrentConvSlice = createSlice({
    name: 'current-conv',
    initialState: initialState as string,
    reducers: {
        updateCurrentConversation(state, action) {
            return action.payload;
        }
    }
});
export const {
    updateCurrentConversation
} = CurrentConvSlice.actions;

// Reducer
export default CurrentConvSlice.reducer;
