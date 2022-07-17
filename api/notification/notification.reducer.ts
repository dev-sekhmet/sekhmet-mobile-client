import {createSlice} from "@reduxjs/toolkit";

export type NotificationVariantType =
    | "error"
    | "success"
    | "info";
export type NotificationsType = {
    id?: number;
    message: string;
    title: string;
    type: NotificationVariantType;
}[];

const initialState: NotificationsType = []
type NotificationState = Readonly<typeof initialState>;

export const NotificationSlice = createSlice({
    name: 'notification',
    initialState: initialState as NotificationState,
    reducers: {
        addNotifications(state, action) {
            return [...state, ...action.payload];
        },
        removeNotifications(state, action) {
            const removeCount = action.payload;
            if (removeCount + 1 > state.length) {
                return [];
            }
            return state.slice(removeCount, state.length);
        }
    }
});
export const {
    addNotifications,
    removeNotifications
} = NotificationSlice.actions;

// Reducer
export default NotificationSlice.reducer;
