import {createSlice} from "@reduxjs/toolkit";
import {Message as TwilioMessage} from "@twilio/conversations";
import {conversationAbsent} from "../../shared/helpers";

export type ChatMessagesState = { channelSid: string; messages: TwilioMessage[] }[];
const initialState: ChatMessagesState = [];

export const MessageListSlice = createSlice({
    name: 'message-list',
    initialState: initialState as ChatMessagesState,
    reducers: {
        pushMessages(state, action) {
            const {channelSid, messages: messagesToAdd} = action.payload;
            if (conversationAbsent(state, channelSid)) {
                return [...state, {channelSid, messages: messagesToAdd}];
            } else {
                // @ts-ignore
                return state.map(conv => {
                    if (conv.channelSid === channelSid) {
                        // @ts-ignore
                        return {channelSid, messages: conv.messages.concat(messagesToAdd)};
                    }
                    return conv;
                });
            }
        },
        addMessages(state, action) {
            const {channelSid, messages: messagesToAdd} = action.payload;
            if (conversationAbsent(state, channelSid)) {
                return [...state, {channelSid, messages: messagesToAdd}];
            } else {

                //get existing messages for the convo
                const existingMessages = state.find(c => c.channelSid === channelSid)?.messages ?? [];
                const filteredExistingMessages = existingMessages.filter(
                    (message: TwilioMessage) => {
                        return !messagesToAdd.find(value =>
                            value.body === message.body &&
                            value.author === message.author &&
                            value.media?.filename === message.media?.filename &&
                            value.media?.size === message.media?.size &&
                            (message.index === -1 || value.index === message.index)
                        );
                    }
                );
                //add new messages to exisiting, ignore duplicates
                const messagesUnique = [...filteredExistingMessages, ...messagesToAdd];

                const sortedMessages = messagesUnique.sort(
                    (a, b) => a.dateCreated.getTime() - b.dateCreated.getTime()
                );

                const map = state.map(conv => {
                    if (conv.channelSid === channelSid) {
                        // @ts-ignore
                        return {channelSid, messages: sortedMessages};
                    }
                    return conv;
                });
                const messages = map.find(c=>c.channelSid === channelSid).messages;
                console.log("elseMessage", messages[messages.length-1].body);
                return map;
            }
        },
        removeMessages(state, action) {
            const {channelSid, messages: messagesToRemove} = action.payload;
            const existingMessages = state.find(c => c.channelSid === channelSid)?.messages ?? [];
            const messages = existingMessages.filter(
                ({index}) =>
                    !messagesToRemove.find(
                        ({index: messageIndex}) => messageIndex === index
                    )
            );

            return state.map(conv => {
                if (conv.channelSid === channelSid) {
                    // @ts-ignore
                    return {channelSid, messages};
                }
                return conv;
            });
        }
    }
});
export const {
    pushMessages,
    removeMessages,
    addMessages
} = MessageListSlice.actions;

// Reducer
export default MessageListSlice.reducer;
