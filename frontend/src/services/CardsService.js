import ApiService from "./ApiService";

/** inicio de Tarjetas de acceso */
export async function apiStoreAccessCard(data){
    let url = '/administration/access-cards';
    let method = 'POST';

    if (data.id) {
        url = '/administration/access-cards/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiGetAccessCards(params){
    return ApiService.fetchData({
        url: 'administration/access-cards',
        method: 'GET',
        params
    });
}

export async function apiGetAccessCard(id){
    return ApiService.fetchData({
        url: 'administration/access-cards/' + id,
        method: 'GET'
    });
}

export async function apiGetAccessCardsActive(){
    return ApiService.fetchData({
        url: 'administration/access-cards-active',
        method: 'GET'
    });
}

export async function apiGetAccessCardActive(id){
    return ApiService.fetchData({
        url: 'administration/access-cards-active/' + id,
        method: 'GET'
    });
}

export async function apiDeleteAccessCard(id) {
    return ApiService.fetchData({
        url: '/administration/access-cards/' + id,
        method: 'DELETE',
    })
}
/** fin de Tipo de Solicitudes */
