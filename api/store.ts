import {AnyAction, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import authentification from './authentification/authentication.reducer';
import settings from './settings/settings.reducer';
import userManagement from './user-management/user-management.reducer';
import conversationWrite from './conversation-write/conversation-write.reducer';
import products from './products/products.reducer';
import  notifications from "./notification/notification.reducer";
import  typingData from "./typing-data/typing-data.reducer";
import currentConv from "./current-conv/current-conv.reducer";
import convos from "./convos/convos.reducer";
import participants from "./participants/participants.reducer";
import messageList from "./message-list/message-list.reducer";
import unreadMessages from "./unread-message/unread-messages.reducer";
import lastReadIndex from "./last-read-index/last-read-index.reducer";

export const store = configureStore({
    reducer: {
        lastReadIndex,
        unreadMessages,
        messageList,
        participants,
        convos,
        currentConv,
        notifications,
        typingData,
        authentification,
        settings,
        userManagement,
        conversationWrite,
        products
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});


const getStore = () => store;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>;

export default getStore;