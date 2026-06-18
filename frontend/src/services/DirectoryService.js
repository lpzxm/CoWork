import ApiService from "./ApiService"

export async function apiGetEmployees(params)
{
    return ApiService.fetchData(
    {
        url: '/administration/employees/directory',
        method: 'GET',
        params
    });
}

export async function apiGetOrganizationalUnits(params)
{
    return ApiService.fetchData(
    {
        url: '/administration/organizational-units-simple',
        method: 'GET',
        params
    });
}

export async function apiGetEmployee(id)
{
    return ApiService.fetchData(
    {
        url: '/administration/employees/'+id,
        method: 'GET'
    });
}

export async function apiGetEmployeesActive()
{
    return ApiService.fetchData(
        {
            url: '/administration/active-employees',
            method: 'GET'
        }
    )
}

export async function apiGetEmployeeWithPic(id)
{
    return ApiService.fetchData(
    {
        url: '/administration/employees/show-pic/'+id,
        method: 'GET'
    });
}

export async function apiGetDirectoriesEmployee() {
    return ApiService.fetchData({ url: '/directory/directories/employee', method: 'GET', })
}

export async function apiGetDirectory(id) {
    return ApiService.fetchData({ url: '/directory/directories/'+id, method: 'GET' })
}

export async function apiGetContactIndexByDirectoryWithImage(id) {
    return ApiService.fetchData({ url: '/directory/contacts/index-by-directory-with-image/'+id, method: 'GET' })
}

export async function apiGetContact(id) {
    return ApiService.fetchData({ url: '/directory/contacts/'+id, method: 'GET' })
}

