import {createSlice} from "@reduxjs/toolkit";
import {uniq} from "lodash";
import {Conversation} from "@twilio/conversations";


const initialState: Conversation[] = [];

export const ConvosSlice = createSlice({
    name: 'convos',
    initialState: initialState as Conversation[],
    reducers: {
        listConversations(state, action) {
            return action.payload.sort((a, b) => {
                return (
                    (b.lastMessage?.dateCreated || b.dateUpdated) -
                    (a.lastMessage?.dateCreated || a.dateUpdated)
                );
            });
        },
        updateConversation(state, action) {
            const stateCopy = [...state];
            let target = stateCopy.find(convo => convo.sid === action.payload.channelSid);

            target =
                target &&
                ({
                    ...target,
                    ...action.payload.parameters,
                });

            return stateCopy;
        },
        removeConversation(state, action) {
            const stateCopy = [...state];

            // @ts-ignore
            return stateCopy.filter(convo => convo.sid !== action.payload);
        }
    }
});
export const {
    removeConversation,
    listConversations,
    updateConversation
} = ConvosSlice.actions;

// Reducer
export default ConvosSlice.reducer;
