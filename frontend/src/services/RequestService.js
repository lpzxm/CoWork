import ApiService from "./ApiService";

/** inicio de Tipo de Solicitudes */
export async function apiStoreRequestType(data){
    let url = 'request/request-types';
    let method = 'POST';

    if (data.id) {
        url = 'request/request-types/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetRequestTypes(params){
    return ApiService.fetchData({
        url: 'request/request-types',
        method: 'GET',
        params
    });
}

export async function apiGetRequestType(id){
    return ApiService.fetchData({
        url: 'request/request-types/' + id,
        method: 'GET'
    });
}

export async function apiGetRequestTypesActive(){
    return ApiService.fetchData({
        url: 'request/request-types-active',
        method: 'GET'
    });
}

export async function apiGetRequestTypeActive(id){
    return ApiService.fetchData({
        url: 'request/request-types-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteRequestType(id) {
    return ApiService.fetchData({
        url: 'request/request-types/' + id,
        method: 'DELETE',
    })
}
/** fin de Tipo de Solicitudes */

/** inicio de Categorías para Tipos de Solicitudes */
export async function apiStoreCategoryStep(data){
    let url = 'request/request-category-steps';
    let method = 'POST';

    if (data.id) {
        url = 'request/request-category-steps/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetCategorySteps(params){
    return ApiService.fetchData({
        url: 'request/request-category-steps',
        method: 'GET',
        params
    });
}

export async function apiGetCategoryStep(id){
    return ApiService.fetchData({
        url: 'request/request-category-steps/' + id,
        method: 'GET'
    });
}

export async function apiGetCategoryStepsActive(){
    return ApiService.fetchData({
        url: 'request/request-category-steps-active',
        method: 'GET'
    });
}

export async function apiGetCategoryStepActive(id){
    return ApiService.fetchData({
        url: 'request/request-category-steps-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteCategoryStep(id) {
    return ApiService.fetchData({
        url: '/request/request-category-steps' + id,
        method: 'DELETE',
    })
}
/** fin de Categorías para Tipos de Solicitudes */

/** inicio de Pasos para Categorías para Tipos de Solicitudes */
export async function apiStoreTypeCategory(data){
    let url = 'request/request-categories';
    let method = 'POST';

    if (data.id) {
        url = 'request/request-categories/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetTypeCategories(params){
    return ApiService.fetchData({
        url: 'request/request-categories',
        method: 'GET',
        params
    });
}

export async function apiGetTypeCategory(id){
    return ApiService.fetchData({
        url: 'request/request-categories/' + id,
        method: 'GET'
    });
}

export async function apiGetTypeCategoriesActive(){
    return ApiService.fetchData({
        url: 'request/request-categories-active',
        method: 'GET'
    });
}

export async function apiGetTypeCategoryActive(id){
    return ApiService.fetchData({
        url: 'request/request-categories-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteTypeCategory(id) {
    return ApiService.fetchData({
        url: 'request/request-categories' + id,
        method: 'DELETE',
    })
}
/** fin de Pasos para Categorías para Tipos de Solicitudes */

/** inicio para Detalles de Solicitudes */
export async function apiStoreRequestDetail(data){
    let url = 'request/request-details';
    let method = 'POST';

    if (data.id) {
        url = 'request/request-details/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetRequestDetails(params){
    return ApiService.fetchData({
        url: 'request/request-details',
        method: 'GET',
        params
    });
}

export async function apiGetRequestDetail(id){
    return ApiService.fetchData({
        url: 'request/request-details-show/' + id,
        method: 'GET'
    });
}

export async function apiGetRequestDetailsActive(){
    return ApiService.fetchData({
        url: 'request/request-details-active',
        method: 'GET'
    });
}

export async function apiGetRequestDetailActive(id){
    return ApiService.fetchData({
        url: 'request/request-details-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteRequestDetail(id){
    return ApiService.fetchData({
        url: 'request/request-details/' + id,
        method: 'DELETE',
    })
}

export async function apiGetRequestByType(info = false){
    let url = 'request/by-types';

    if (info) {
        url = 'request/by-types/info';
    }

    return ApiService.fetchData({
        url: url,
        method: 'GET'
    });
}

export async function apiGetRequestByCategory(info = false){
    let url = 'request/by-categories';

    if (info) {
        url = 'request/by-categories/info';
    }

    return ApiService.fetchData({
        url: url,
        method: 'GET',
    });
}

export async function apiGetRequestAssigned(info = false){
    let url = 'request/assigned';
    if (info) {
        url = 'request/assigned/info';
    }

    return ApiService.fetchData({
        url: url,
        method: 'GET',
    });
}

export async function apiGetRequestCreated(info = false){
    let url = 'request/created';

    if (info) {
        url = 'request/created/info';
    }

    return ApiService.fetchData({
        url: url,
        method: 'GET',
    });
}
/** fin para Detalles de Solicitudes */

/** inicio para Respuestas de Solicitudes */
export async function apiStoreRequestResponse(data){
    let url = 'request/request-responses';
    let method = 'POST';

    if (data.id) {
        url = 'request/request-responses/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetRequestResponses(params){
    return ApiService.fetchData({
        url: 'request/request-responses',
        method: 'GET',
        params
    });
}

export async function apiGetRequestResponse(id){
    return ApiService.fetchData({
        url: 'request/request-responses/' + id,
        method: 'GET'
    });
}

export async function apiGetRequestResponsesActive(){
    return ApiService.fetchData({
        url: 'request/request-responses-active',
        method: 'GET'
    });
}

export async function apiGetRequestResponseActive(id){
    return ApiService.fetchData({
        url: 'request/request-responses-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteRequestResponse(id) {
    return ApiService.fetchData({
        url: 'request/request-responses/' + id,
        method: 'DELETE',
    })
}

export async function apiDownloadRequestDetailAttachment(id){
    return ApiService.fetchData({
        url: 'request/request-detail-attaches/' + id,
        method: 'GET'
    });
}

export async function apiDownloadRequestResponseAttachment(id){
    return ApiService.fetchData({
        url: 'request/request-response-attaches/' + id,
        method: 'GET'
    });
}

export async function apiStoreCategoryAttach(data){
    return ApiService.fetchData({
        url: 'request/request-category-attaches',
        method: 'POST',
        data
    })
}

export async function apiDeleteCategoryAttach(id){
    return ApiService.fetchData({
        url: 'request/request-category-attaches/' + id,
        method: 'DELETE',
    })
}

/** fin para Respuestas de Solicitudes */