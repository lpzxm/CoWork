import ApiService from './ApiService'

export async function apiGetMarkingsByPeriod(params) {
    return ApiService.fetchData({ url: '/attendance/markings/by-period', method: 'GET', params })
}

export async function apiGetDiscountByDate(params) {
    return ApiService.fetchData({ url: '/attendance/discounts/by-date', method: 'GET', params })
}

export async function apiSyncMarkingDevices(data) {
    return ApiService.fetchData({ url: '/attendance/markings/sync-devices', method: 'POST', data })
}

export async function apiSetMarkingsPeriodData(data) {
    return ApiService.fetchData({ url: '/attendance/markings/set-period-data', method: 'POST', data })
}

export async function apiCalculatePeriodDiscounts(data) {
    return ApiService.fetchData({ url: '/attendance/discounts/calculate-period', method: 'POST', data })
}

export async function apiMarkingsSyncByFile(data) {
    return ApiService.fetchData({ url: '/attendance/markings/sync-by-file', method: 'POST', data })
}

export async function apiPermissionTypesIndexActive(params) {
    return ApiService.fetchData({ url: '/attendance/permission-types/active', method: 'GET', params })
}

export async function apiPermissionTypesShowSimple(params) {
    return ApiService.fetchData({ url: '/attendance/permission-types/show-simple', method: 'GET', params })
}

export async function apiGetEmployeePermissions({id,state}) {
    return ApiService.fetchData({ url: 'attendance/permissions/index-employee/'+id+'/state/'+state, method: 'GET' })
}

export async function apiGetOrganizationUnitPermissions({id,state,organizationalUnitId}) {
    return ApiService.fetchData({ url: 'attendance/permissions/index-organizational-unit/'+id+'/state/'+state+'/organizational-unit/'+organizationalUnitId, method: 'GET' })
}

export async function apiGetAllPermissions() {
    return ApiService.fetchData({ url: 'attendance/permissions/index-all', method: 'GET' })
}

export async function apiGetPermissionsByState({state}) {
    return ApiService.fetchData({ url: 'attendance/permissions/index-by-state/'+state, method: 'GET' })
}

export async function apiGetHolidays() {
    return ApiService.fetchData({ url: 'attendance/holidays', method: 'GET' })
}

export async function apiGetHoliday(id) {
    return ApiService.fetchData({ url: 'attendance/holidays/'+id, method: 'GET' })
}

export async function apiDeleteHoliday(id) {
    return ApiService.fetchData({ url: 'attendance/holidays/'+id, method: 'DELETE' })
}

export async function apiGetPermission(id) {
    return ApiService.fetchData({ url: 'attendance/permissions/'+id, method: 'GET' })
}

export async function apiGetPermissionFileDownload(id) {
    return ApiService.fetchData({ url: 'attendance/permissions/download/'+id, method: 'GET', })
}


export async function apiGetCompensatoriesByEmployee(id) {
    return ApiService.fetchData({ url: 'attendance/compensatories/by-employee/'+id, method: 'GET' })
}

export async function apiGetCompensatoriesByOrganizationalUnit(id) {
    return ApiService.fetchData({ url: 'attendance/compensatories/by-organizational-unit/'+id, method: 'GET' })
}

export async function apiGetCompensatoriesAll() {
    return ApiService.fetchData({ url: 'attendance/compensatories/all', method: 'GET' })
}

export async function apiGetCompensatory(id) {
    return ApiService.fetchData({ url: 'attendance/compensatories/'+id, method: 'GET' })
}

export async function apiGetMarkingByDateEmployee({date,employeeId}) {
    return ApiService.fetchData({ url: 'attendance/markings/by-date-employee/date/'+date+'/employee/'+employeeId, method: 'GET' })
}

export async function apiGetCompensatoryAvailableTime({employeeId}) {
    return ApiService.fetchData({ url: 'attendance/compensatories/by-employee/'+employeeId+'/available-time', method: 'GET' })
}

export async function apiGetPermissionTypes() {
    return ApiService.fetchData({ url: '/attendance/permission-types', method: 'GET' })
}

export async function apiGetPermissionType(id) {
    return ApiService.fetchData({ url: '/attendance/permission-types/'+id, method: 'GET' })
}

export async function apiDeletePermissionType(id) {
    return ApiService.fetchData({ url: 'attendance/permission-types/'+id, method: 'DELETE' })
}

export async function apiGetPermissionRequestsFromEmployeeByPeriod( params) {
    const employeeId = params.adm_employee_id
    return ApiService.fetchData({ url: 'attendance/permission-requests/employee/'+employeeId+'/period', method: 'GET', params })
}

export async function apiGetPermissionRequestsFromEmployeeAndState( { employeeId, state } ) {
    return ApiService.fetchData({ url: 'attendance/permission-requests/by-employee/'+employeeId+'/state/'+state, method: 'GET' })
}

export async function apiGetPermissionRequestsByOrganizationalUnitAndState( { organizationalUnitId, state } ) {
    return ApiService.fetchData({ url: 'attendance/permission-requests/by-organizational-unit/'+organizationalUnitId+'/state/'+state, method: 'GET' })
}

export async function apiGetPermissionRequestsByOrganizationalUnitAndStateWithChildren( { organizationalUnitId, state } ) {
    return ApiService.fetchData({ url: 'attendance/permission-requests/by-organizational-unit-with-children/'+organizationalUnitId+'/state/'+state, method: 'GET' })
}

export async function apiStorePermissionRequest(data) {
    return ApiService.fetchData({ url: '/attendance/permission-requests', method: 'POST', data })
}

export async function apiValidateStorePermissionRequest(data) {
    return ApiService.fetchData({ url: '/attendance/permission-requests/validate-store', method: 'POST', data })
}

export async function apiGetPermissionRequest( id ) {
    return ApiService.fetchData({ url: '/attendance/permission-requests/'+ id, method: 'GET' })
}

export async function apiGetPermissionRequestFromOrganizationalUnit( { organizationalUnitId, childrens, activeOnly, state } ) {
    return ApiService.fetchData({ 
        url: '/attendance/permission-requests/organizational-unit/'+organizationalUnitId+'/childrens/'+childrens+'/active-only/'+activeOnly+'/state/'+state,
        method: 'GET'
    })
}

export async function apiGetPermissionTypesResumeFromEmployee( { employeeId, dateIni, dateEnd } ) {
    return ApiService.fetchData({ 
        url: '/attendance/permission-types/resume-employee/'+employeeId+'/date-ini/'+dateIni+'/date-end/'+dateEnd,
        method: 'GET'
    })
}

