import ApiService from "./ApiService";

export async function apiGetActiveResourceTypes() {
    return ApiService.fetchData(
        {
            url: '/reservations/active-resource-types',
            method: 'GET',
        }
    );
}

export async function apiGetActiveResourceTypesAll() {
    return ApiService.fetchData(
        {
            url: '/reservations/active-resource-types-all',
            method: 'GET',
        }
    );
}

export async function apiGetResourceTypes(params) {
    return ApiService.fetchData(
        {
            url: '/reservations/resource-types',
            method: 'GET',
            params
        }
    );
}

export async function apiGetResourceType(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/resource-types/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreResourceType(data) {
    let url = '/reservations/resource-types';
    let method = 'POST';

    if (data.id) {
        url = '/reservations/resource-types/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteResourceType(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/resource-types/' + id,
            method: 'DELETE',
        }
    )
}

export async function apiGetActiveResources(params) {
    return ApiService.fetchData(
        {
            url: '/reservations/active-resources',
            method: 'GET',
            params
        }
    );
}

export async function apiGetResources(params) {
    return ApiService.fetchData(
        {
            url: '/reservations/resources',
            method: 'GET',
            params
        }
    );
}

export async function apiGetResource(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/resources/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreResource(data) {
    let url = '/reservations/resources';
    let method = 'POST';

    if (data.id) {
        url = '/reservations/resources/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteResource(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/resources/' + id,
            method: 'DELETE',
        }
    )
}

export async function apiGetBookings(params) {
    return ApiService.fetchData(
        {
            url: '/reservations/bookings',
            method: 'GET',
            params
        }
    );
}

export async function apiGetBooking(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/bookings' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreBooking(data) {
    let url = '/reservations/bookings';
    let method = 'POST';

    if (data.id) {
        url = '/reservations/bookings/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteBooking(id) {
    return ApiService.fetchData(
        {
            url: '/reservations/bookings/' + id,
            method: 'DELETE',
        }
    )
}