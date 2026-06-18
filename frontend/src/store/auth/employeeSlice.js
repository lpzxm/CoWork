import { createSlice } from '@reduxjs/toolkit'

export const initialState =
{
    id:'',
    name:'',
    lastname:'',
    email:'',
    email_personal:'',
    phone:'',
    phone_personal:'',
    birthday:'',
    marking_required:'',
    status:'',
    active:'',
    user_id:'',
    adm_gender_id:'',
    adm_marital_status_id:'',
    adm_address_id:'',
    photo:''
}

export const employeeSlice = createSlice({
	name: 'auth/employee',
	initialState,
	reducers: {
        setEmployee:    (_, action) => action.payload,
        userLoggedOut:  () => initialState,
	},
});

export const { setEmployee } = employeeSlice.actions

export default employeeSlice.reducer