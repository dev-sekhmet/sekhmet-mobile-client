import {createSlice} from "@reduxjs/toolkit";

const initialState = -1;

export const LastReadIndexSlice = createSlice({
    name: 'last-read-index',
    initialState: initialState as number,
    reducers: {
        setLastReadIndex(state, action) {
            return action.payload;
        }
    }
});
export const {
    setLastReadIndex
} = LastReadIndexSlice.actions;

// Reducer
export default LastReadIndexSlice.reducer;
