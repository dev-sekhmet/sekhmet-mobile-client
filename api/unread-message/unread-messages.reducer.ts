import {createSlice} from "@reduxjs/toolkit";
import {uniq} from "lodash";
import {conversationAbsent} from "../../shared/helpers";

export type ChannelMessageCountType = { channelUniqId: string; unreadCount: number };
export type UnreadMessagesState = ChannelMessageCountType[];

const initialState: UnreadMessagesState = [];

export const UnreadMessagesSlice = createSlice({
    name: 'typing-data',
    initialState: initialState as UnreadMessagesState,
    reducers: {
        updateUnreadMessages(state, action) {
              const {channelUniqId, unreadCount} = action.payload;
            if (conversationAbsent(state, channelUniqId)) {
                    return  [...state, {channelUniqId, unreadCount}];
                } else {
                    return state.map(conv => {
                        if (conv.channelUniqId === channelUniqId) {
                            return {channelUniqId, unreadCount};
                        }
                        return conv;
                    });
                }
        }
    }
});
export const {
    updateUnreadMessages
} = UnreadMessagesSlice.actions;

// Reducer
export default UnreadMessagesSlice.reducer;
