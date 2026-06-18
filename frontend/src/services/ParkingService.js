import ApiService from "./ApiService";

/** Services para Areas */

export async function apiGetActiveParkingAreas() {
    return ApiService.fetchData(
        {
            url: '/administration/parking-areas',
            method: 'GET',
        }
    );
}
export async function apiGetActiveParkingArea(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-areas-active/' + id,
            method: 'GET',
        }
    );
}

export async function apiGetParkingAreas(params) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-areas',
            method: 'GET',
            params
        }
    );
}
export async function apiGetParkingArea(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-areas/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreParkingArea(data) {
    let url = '/administration/parking-areas';
    let method = 'POST';

    if (data.id) {
        url = '/administration/parking-areas/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteParkingArea(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-areas/' + id,
            method: 'DELETE',
        }
    )
}

/** Services para Niveles */

export async function apiGetActiveParkingAreaLevels() {
    return ApiService.fetchData(
        {
            url: '/administration/parking-area-levels',
            method: 'GET',
        }
    );
}

export async function apiGetParkingAreaLevels(params) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-area-levels',
            method: 'GET',
            params
        }
    );
}
export async function apiGetParkingAreaLevel(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-area-levels/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreParkingAreaLevel(data) {
    let url = '/administration/parking-area-levels';
    let method = 'POST';

    if (data.id) {
        url = '/administration/parking-area-levels/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteParkingAreaLevel(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parking-area-levels/' + id,
            method: 'DELETE',
        }
    )
}

/** Services para Parqueos */

export async function apiGetActiveParkings() {
    return ApiService.fetchData(
        {
            url: '/administration/parkings',
            method: 'GET',
        }
    );
}

export async function apiGetParkings(params) {
    return ApiService.fetchData(
        {
            url: '/administration/parkings',
            method: 'GET',
            params
        }
    );
}
export async function apiGetParking(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parkings/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreParking(data) {
    let url = '/administration/parkings';
    let method = 'POST';

    if (data.id) {
        url = '/administration/parkings/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteParking(id) {
    return ApiService.fetchData(
        {
            url: '/administration/parkings/' + id,
            method: 'DELETE',
        }
    )
}