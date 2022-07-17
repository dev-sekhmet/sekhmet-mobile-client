import {createSlice} from "@reduxjs/toolkit";
import {uniq} from "lodash";

export type TypingDataState = { channelSid: string; participants: string[] }[];

const initialState: TypingDataState = [];

export const TypingDataSlice = createSlice({
    name: 'typing-data',
    initialState: initialState as TypingDataState,
    reducers: {
        startTyping(state, action) {
            const {channelSid, participant} = action.payload;
            if (!state.length) {
                return [{channelSid, participants: [participant]}];
            } else {
                return state.map(conv => {
                    if (conv.channelSid === channelSid) {
                        return {channelSid, participants: uniq([...conv.participants, participant])};
                    }
                    return conv;
                });
            }
        },
        endTyping(state, action) {
            const {channelSid, participant} = action.payload;
            return state.map(conv => {
                if (conv.channelSid === channelSid) {
                    return {channelSid, participants: conv.participants.filter(u => u !== participant)};
                }
                return conv;
            });
        }
    }
});
export const {
    startTyping,
    endTyping
} = TypingDataSlice.actions;

// Reducer
export default TypingDataSlice.reducer;
