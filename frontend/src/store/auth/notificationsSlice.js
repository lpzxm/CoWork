import { createSlice } from '@reduxjs/toolkit'

export const initialState =
{
    notifications:[]
}

export const notificationsSlice = createSlice({
	name: 'auth/notifications',
	initialState,
	reducers: {
        setNotifications:       (_, action) => action.payload,
        userLoggedOut:  ()          => initialState,
	},
});

export const { setNotifications } = notificationsSlice.actions

export default notificationsSlice.reducer