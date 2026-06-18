import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    current_general_key: '',
    current_route_key: '',
    current_route_index: 1,
    current_route_sub_index: 1,
    current_route_title: '',
    current_route_subtitle: '',
    current_route_info:'',
    current_route_options: null,
    current_route_sub_options: null,
}

export const commonSlice = createSlice({
    name: 'base/common',
    initialState,
    reducers: {
        setCurrentGeneralKey: (state, action) => {
            state.current_general_key = action.payload
        },
        setCurrentRouteKey: (state, action) => {
            state.current_route_key = action.payload
        },
        setCurrentRouteIndex: (state, action) => {
            state.current_route_index = action.payload
        },
        setCurrentRouteSubIndex: (state, action) => {
            state.current_route_sub_index = action.payload
        },
        setCurrentRouteTitle: (state, action) => {
            state.current_route_title = action.payload
        },
        setCurrentRouteSubtitle: (state, action) => {
            state.current_route_subtitle = action.payload
        },
        setCurrentRouteInfo: (state, action) => {
            state.current_route_info = action.payload
        },
        setCurrentRouteOptions: (state, action) => {
            state.current_route_options = action.payload
        },
        setCurrentRouteSubOptions: (state, action) => {
            state.current_route_sub_options = action.payload
        }
    },
})

export const { setCurrentGeneralKey,setCurrentRouteKey,setCurrentRouteTitle,setCurrentRouteSubtitle,setCurrentRouteInfo,setCurrentRouteOptions,setCurrentRouteSubOptions,setCurrentRouteIndex,setCurrentRouteSubIndex } = commonSlice.actions

export default commonSlice.reducer
