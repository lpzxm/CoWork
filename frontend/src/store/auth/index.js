import { combineReducers } from '@reduxjs/toolkit';
import session from './sessionSlice';
import user from './userSlice';
import employee from './employeeSlice';
import functionalPosition from './functionalPositionSlice';
import organizationalUnit from './organizationalUnitSlice';
import notifications from './notificationsSlice';


const reducer = combineReducers({
    session,
    user,
    employee,
    functionalPosition,
    organizationalUnit,
    notifications
});

export default reducer;