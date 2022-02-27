import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type LastMessage = {
    message: string,
    dateUpdated:  Date | null
};

export type MessagesState = {
    lastMessages: Record<string, LastMessage>,
    unreadMessagesCount: Record<string, number>
};

const initialState: MessagesState = {
    lastMessages: {},
    unreadMessagesCount: {}
};

export type UnreadCountParam = { channelSid: string; unreadCount: number };
export type LastMessageParam = { channelSid: string; lastMessage: LastMessage};
export const MessagesSlice = createSlice({
    name: 'messagesState',
    initialState: initialState as MessagesState,
    reducers: {
        updateUnreadMessagesCount(state, action: PayloadAction<UnreadCountParam>) {
            //get convo sid and messages to add from payload
            const {channelSid, unreadCount} = action.payload;
            //overwrite the channelSid unread count
            return {
                ...state,
                unreadMessagesCount: Object.assign({}, state.unreadMessagesCount, {[channelSid]: unreadCount})
            };

        },
        updateLastMessage(state, action: PayloadAction<LastMessageParam>) {
            console.log("action.payload", action.payload)
            //get convo sid and messages to add from payload
            const {channelSid, lastMessage} = action.payload;
            //overwrite the channelSid lastMessages
            return {
                ...state,
                lastMessages: Object.assign({}, state.lastMessages, {[channelSid]: {message: lastMessage.message, dateUpdated: lastMessage.dateUpdated}})
            };

        }
    }
});


export const {updateUnreadMessagesCount, updateLastMessage} = MessagesSlice.actions;
export default MessagesSlice.reducer;