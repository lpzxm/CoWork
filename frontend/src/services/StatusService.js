import ApiService from './ApiService'

export async function apiGetStatuses() {
    return ApiService.fetchData({ url: '/status', method: 'GET' })
}

export async function apiCreateStatus(data) {
    return ApiService.fetchData({ url: '/status', method: 'POST', data })
}

export async function apiUpdateStatus(id, data) {
    return ApiService.fetchData({ url: `/status/${id}`, method: 'PUT', data })
}

export async function apiDeleteStatus(id) {
    return ApiService.fetchData({ url: `/status/${id}`, method: 'DELETE' })
}
