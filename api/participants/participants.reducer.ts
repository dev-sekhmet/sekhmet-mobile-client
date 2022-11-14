import {createSlice} from "@reduxjs/toolkit";
import {Participant} from "@twilio/conversations";
import {conversationAbsent} from "../../shared/helpers";

export type ParticipantsType = { channelSid: string; participants: Participant[] }[];
const initialState: ParticipantsType = [];

export const ParticipantsSlice = createSlice({
    name: 'participants',
    initialState: initialState as ParticipantsType,
    reducers: {
        updateParticipants(state, action) {
            const {channelSid, participants} = action.payload;
            if (conversationAbsent(state, channelSid)) {
                return [...state, {channelSid, participants}];
            } else {
                // @ts-ignore
                return state.map(conv => {
                    if (conv.channelSid === channelSid) {
                        // @ts-ignore
                        return {channelSid, participants};
                    }
                    return conv;
                });
            }
        }
    }
});
export const {
    updateParticipants
} = ParticipantsSlice.actions;

// Reducer
export default ParticipantsSlice.reducer;
