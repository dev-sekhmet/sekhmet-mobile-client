import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type UnreadMessagesState = Record<string, number>;

const initialState: UnreadMessagesState = {};

export type UnreadCountParam = { channelSid: string; unreadCount: number };
export const UnreadMessagesSlice = createSlice({
    name: 'unreadmessagesState',
    initialState: initialState as UnreadMessagesState,
    reducers: {
        updateUnreadMessages(state, action:PayloadAction<UnreadCountParam>) {
            //get convo sid and messages to add from payload
            const { channelSid, unreadCount } = action.payload;
            //overwrite the channelSid unread count
            return Object.assign({}, state, { [channelSid]: unreadCount });

        },
    }
});


export const {updateUnreadMessages} = UnreadMessagesSlice.actions;
export default UnreadMessagesSlice.reducer;