import ApiService from "./ApiService";

/** Acciones para Courier */

export async function apiStoreCourier(data) {
    let url = 'courier/couriers';
    let method = 'POST';

    if (data.get('id')) {
        url = 'courier/couriers/' + data.get('id');
        data.append('_method', 'PATCH');
    } 

    return ApiService.fetchData({
        url: url,
        method: method,
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function apiGetCouriers(params) {
    return ApiService.fetchData({
        url: 'courier/couriers',
        method: 'GET',
        params
    });
}

export async function apiGetCourier(id) {
    return ApiService.fetchData({
        url: 'courier/couriers/' + id,
        method: 'GET'
    });
}

export async function apiGetCouriersActive() {
    return ApiService.fetchData({
        url: 'courier/couriers-active',
        method: 'GET'
    });
}

export async function apiGetCourierActive(id) {
    return ApiService.fetchData({
        url: 'courier/couriers-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteCourier(id) {
    return ApiService.fetchData({
        url: 'courier/couriers/' + id,
        method: 'DELETE'
    });
}

/** Acciones para Detalles */

export async function apiStoreCourierDetail(data) {
    let url = 'courier/courier-details'; 
    let method = 'POST';

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetCourierDetails(params) {
    return ApiService.fetchData({
        url: 'courier/courier-details',
        method: 'GET',
        params
    });
}

export async function apiGetCourierDetail(id) {
    return ApiService.fetchData({
        url: 'courier/courier-details/' + id,
        method: 'GET'
    });
}

export async function apiDeleteCourierDetail(id) {
    return ApiService.fetchData({
        url: 'courier/courier-details/' + id,
        method: 'DELETE'
    });
}

/** Acciones para Mensajes */

export async function apiStoreCourierDetailMessage(data) {
    let url = 'courier/courier-detail-messages';
    let method = 'POST';

    if (data.id) {
        url = 'courier/couriers/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiSendEmployeeNotification(data) {
    return ApiService.fetchData({
        url: 'courier/courier-send-message',
        method: 'POST',
        data
    })
}

export async function apiGetCourierDetailEmployees(id) {
    return ApiService.fetchData({ url: 'courier/courier-detail-employees/'+id, method: 'GET', })
}

export async function apiGetDetailEmployeeMessages(data) {
    return ApiService.fetchData({ url: 'courier/courier-detail-employee-messages', method: 'POST', data })
}
