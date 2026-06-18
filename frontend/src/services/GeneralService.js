import ApiService from "./ApiService";

export async function apiGetActiveConfigurations() {
    return ApiService.fetchData(
        {
            url: '/general/configurations',
            method: 'GET',
        }
    );
}

export async function apiGetConfigurations(params) {
    return ApiService.fetchData(
        {
            url: '/general/configurations',
            method: 'GET',
            params
        }
    );
}

export async function apiGetConfiguration(id) {
    return ApiService.fetchData(
        {
            url: '/general/configurations/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreConfiguration(data) {
    let url = '/general/configurations';
    let method = 'POST';

    if (data.id) {
        url = '/general/configurations/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteConfiguration(id) {
    return ApiService.fetchData(
        {
            url: '/general/configurations/' + id,
            method: 'DELETE',
        }
    )
}

export async function apiGetDistributors() {
    return ApiService.fetchData(
        {
            url: '/general/distributors',
            method: 'GET',
        }
    );
}

export async function apiGetDepartments() {
    return ApiService.fetchData(
        {
            url: '/general/departments',
            method: 'GET',
        }
    );
}

export async function apiGetMunicipalitiesByDepartment( departmentId ) {
    return ApiService.fetchData(
        {
            url: '/general/departments/' + departmentId + '/municipalities',
            method: 'GET',
        }
    );
}

export async function apiGetDistrictsByDepartment( departmentId )
{
    const url = departmentId ? '/general/departments/' + departmentId + '/districts' : '/general/districts' ;
    return ApiService.fetchData(
        {
            url,
            method: 'GET',
        }
    );
}

export async function apiGetMunicipalities() {
    return ApiService.fetchData(
        {
            url: '/general/municipalities',
            method: 'GET',
        }
    );
}

export async function apiGetDistricts() {
    return ApiService.fetchData(
        {
            url: '/general/districts',
            method: 'GET',
        }
    );
}