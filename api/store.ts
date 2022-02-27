import {AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import authentification from './authentification/authentication.reducer';
import settings from './settings/settings.reducer';
import search from './search/search.reducer';
import messages from './messages/messages.reducer';
import userManagement from './user-management/user-management.reducer';
import conversationWrite from './conversation-write/conversation-write.reducer';

export const store = configureStore({
    reducer: {
        authentification,
        settings,
        search,
        messages,
        userManagement,
        conversationWrite
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