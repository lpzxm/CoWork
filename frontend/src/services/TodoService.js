import ApiService from './ApiService'

export async function apiGetTaskCategories() {
    return ApiService.fetchData({
        url: '/todo/task-categories',
        method: 'GET',
    })
}

export async function apiCreateTaskCategory(data) {
    return ApiService.fetchData({
        url: '/todo/task-categories',
        method: 'POST',
        data,
    })
}

export async function apiUpdateTaskCategory(id, data) {
    return ApiService.fetchData({
        url: `/todo/task-categories/${id}`,
        method: 'PUT',
        data,
    })
}

export async function apiDeleteTaskCategory(id) {
    return ApiService.fetchData({
        url: `/todo/task-categories/${id}`,
        method: 'DELETE',
    })
}

export async function apiGetTasks(params = null) {
    return ApiService.fetchData({
        url: '/todo/tasks',
        method: 'GET',
        params,
    })
}

export async function apiGetTaskStatistics() {
    return ApiService.fetchData({
        url: '/todo/tasks/statistics/summary',
        method: 'GET',
    })
}

export async function apiCreateTask(data) {
    return ApiService.fetchData({
        url: '/todo/tasks',
        method: 'POST',
        data,
    })
}

export async function apiUpdateTask(id, data) {
    return ApiService.fetchData({
        url: `/todo/tasks/${id}`,
        method: 'PUT',
        data,
    })
}

export async function apiUpdateTaskStatus(id, data) {
    return ApiService.fetchData({
        url: `/todo/tasks/${id}/status`,
        method: 'PATCH',
        data,
    })
}

export async function apiDeleteTask(id) {
    return ApiService.fetchData({
        url: `/todo/tasks/${id}`,
        method: 'DELETE',
    })
}
