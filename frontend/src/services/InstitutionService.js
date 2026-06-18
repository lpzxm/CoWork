import ApiService from './ApiService'

export async function apiGetEntries() {
    return ApiService.fetchData({ url: '/institution/entries', method: 'GET', })
}

export async function apiGetEntry(id) {
    return ApiService.fetchData({ url: '/institution/entries/'+id, method: 'GET' })
}

export async function apiDeleteEntry(id) {
    return ApiService.fetchData({ url: '/institution/entries/'+id, method: 'DELETE' })
}

export async function apiGetEntriesIndexWithFilesByType(type) {
    return ApiService.fetchData({ url: '/institution/entries/index-with-files-by-type/type/'+type, method: 'GET' })
}

export async function apiGetEntriesIndexWithFilesByTypeAndSubtype(type,subtype) {
    return ApiService.fetchData({ url: '/institution/entries/index-with-files-by-type-and-subtype/type/'+type+'/subtype/'+subtype, method: 'GET' })
}

export async function apiGetEntryShowActiveWithFilesByTypeAndSubtype(type,subtype) {
    return ApiService.fetchData({ url: '/institution/entries/show-active-with-files-by-type-and-subtype/type/'+type+'/subtype/'+subtype, method: 'GET' })
}