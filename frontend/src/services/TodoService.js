import ApiService from './ApiService'

export async function apiGetTaskCategories() {
    return ApiService.fetchData({
        url: '/task-categories',
        method: 'GET',
    })
}

export async function apiCreateTaskCategory(data) {
    return ApiService.fetchData({
        url: '/task-categories',
        method: 'POST',
        data,
    })
}

export async function apiUpdateTaskCategory(id, data) {
    return ApiService.fetchData({
        url: `/task-categories/${id}`,
        method: 'PUT',
        data,
    })
}

export async function apiDeleteTaskCategory(id) {
    return ApiService.fetchData({
        url: `/task-categories/${id}`,
        method: 'DELETE',
    })
}

export async function apiGetTask(id) {
    return ApiService.fetchData({
        url: `/tasks/${id}`,
        method: 'GET',
    })
}

export async function apiGetTasks(params = null) {
    return ApiService.fetchData({
        url: '/tasks',
        method: 'GET',
        params,
    })
}

export async function apiRequestReview(id) {
    return ApiService.fetchData({
        url: `/tasks/${id}/request-review`,
        method: 'PATCH',
    })
}

export async function apiApproveReview(id, action, observation) {
    return ApiService.fetchData({
        url: `/tasks/${id}/review`,
        method: 'PATCH',
        data: { action, observation },
    })
}

export async function apiCreateTask(data) {
    return ApiService.fetchData({
        url: '/tasks',
        method: 'POST',
        data,
    })
}

export async function apiUpdateTask(id, data) {
    return ApiService.fetchData({
        url: `/tasks/${id}`,
        method: 'PUT',
        data,
    })
}

export async function apiUpdateTaskStatus(id, data) {
    return ApiService.fetchData({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        data,
    })
}

export async function apiDeleteTask(id) {
    return ApiService.fetchData({
        url: `/tasks/${id}`,
        method: 'DELETE',
    })
}

export async function apiGetSubTasks(taskId) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}/subtasks`,
        method: 'GET',
    })
}

export async function apiCreateSubTask(taskId, data) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}/subtasks`,
        method: 'POST',
        data,
    })
}

export async function apiUpdateSubTask(id, data) {
    return ApiService.fetchData({
        url: `/subtasks/${id}`,
        method: 'PUT',
        data,
    })
}

export async function apiDeleteSubTask(id) {
    return ApiService.fetchData({
        url: `/subtasks/${id}`,
        method: 'DELETE',
    })
}
