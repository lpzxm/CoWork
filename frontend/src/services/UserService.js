import ApiService from './ApiService'

export async function apiGetUsers() {
    return ApiService.fetchData({ url: '/users', method: 'GET' })
}

export async function apiCreateUser(data) {
    return ApiService.fetchData({ url: '/users', method: 'POST', data })
}

export async function apiUpdateUser(id, data) {
    return ApiService.fetchData({ url: `/users/${id}`, method: 'PUT', data })
}

export async function apiDeleteUser(id) {
    return ApiService.fetchData({ url: `/users/${id}`, method: 'DELETE' })
}
