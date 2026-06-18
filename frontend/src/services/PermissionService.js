import ApiService from './ApiService'

export async function apiGetPermissions() {
	return ApiService.fetchData({
		url: '/permission/permissions',
		method: 'GET',
	})
}

export async function apiGetRoles() {
	return ApiService.fetchData({
		url: '/permission/roles',
		method: 'GET',
	})
}

export async function apiCreateRole(data) {
	return ApiService.fetchData({
		url: '/permission/roles',
		method: 'POST',
		data,
	})
}

export async function apiUpdateRole(id, data) {
	return ApiService.fetchData({
		url: `/permission/roles/${id}`,
		method: 'PUT',
		data,
	})
}

export async function apiDeleteRole(id) {
	return ApiService.fetchData({
		url: `/permission/roles/${id}`,
		method: 'DELETE',
	})
}

export async function apiSyncRolePermissions(id, data) {
	return ApiService.fetchData({
		url: `/permission/roles/${id}/permissions`,
		method: 'PUT',
		data,
	})
}

export async function apiGetUsers() {
	return ApiService.fetchData({
		url: '/permission/users',
		method: 'GET',
	})
}

export async function apiCreateUser(data) {
	return ApiService.fetchData({
		url: '/permission/users',
		method: 'POST',
		data,
	})
}

export async function apiUpdateUser(id, data) {
	return ApiService.fetchData({
		url: `/permission/users/${id}`,
		method: 'PUT',
		data,
	})
}

export async function apiDeleteUser(id) {
	return ApiService.fetchData({
		url: `/permission/users/${id}`,
		method: 'DELETE',
	})
}

export async function apiSyncUserRoles(id, data) {
	return ApiService.fetchData({
		url: `/permission/users/${id}/roles`,
		method: 'PUT',
		data,
	})
}
