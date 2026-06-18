import ApiService from './ApiService'

export async function apiUploadFile(formData) {
    return ApiService.fetchData({
        url: '/files',
        method: 'POST',
        data: formData,
    })
}

export async function apiDeleteFile(id) {
    return ApiService.fetchData({
        url: `/files/${id}`,
        method: 'DELETE',
    })
}

export async function apiDownloadFile(id) {
    return ApiService.fetchData({
        url: `/files/${id}`,
        method: 'GET',
        responseType: 'blob',
    })
}
