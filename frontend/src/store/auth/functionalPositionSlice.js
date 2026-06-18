import { createSlice } from '@reduxjs/toolkit'

export const initialState =
{
    id:'',
    name:'',
    abbreviation:'',
    description:'',
    amount_required:'',
    salary_min:'',
    salary_max:'',
    boss:'',
    boss_hierarchy:'',
    original:'',
    user_required:'',
    active:'',
    adm_organizational_unit_id:'',
    adm_functional_position_id:''
}

export const functionalPositionSlice = createSlice({
	name: 'auth/functional_position',
	initialState,
	reducers: {
        setFunctionalPosition:       (_, action) => action.payload,
        userLoggedOut:  ()          => initialState,
	},
});

export const { setFunctionalPosition } = functionalPositionSlice.actions

export default functionalPositionSlice.reducer