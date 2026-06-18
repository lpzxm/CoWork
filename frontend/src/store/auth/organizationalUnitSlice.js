import { createSlice } from '@reduxjs/toolkit'

export const initialState =
{
    id:'',
    nombre:'',
    abreviatura:'',
    habilitado:'',
}

export const organizationalUnitSlice = createSlice({
	name: 'auth/organizational_unit',
	initialState,
	reducers: {
        setOrganizationalUnit:       (_, action) => action.payload,
        userLoggedOut:  ()          => initialState,
	},
});

export const { setOrganizationalUnit } = organizationalUnitSlice.actions

export default organizationalUnitSlice.reducer