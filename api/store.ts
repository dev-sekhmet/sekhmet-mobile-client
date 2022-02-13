import {AnyAction, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import authentification from './authentification/authentication.reducer';
import settings from './settings/settings.reducer';
import search from './search/search.reducer';
import chat from './chat/chat.reducer';

export const store = configureStore({
    reducer: {
        authentification,
        settings,
        chat,
        search
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.config', 'payload.request', 'error', 'meta.arg'],
            },
        })
});


const getStore = () => store;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>;

export default getStore;