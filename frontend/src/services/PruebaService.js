import ApiService from "./ApiService";

const PREFIX_PRUEBA = '/prueba';
const PREFIX_TESTER = '/tester';

export async function apiGetTesters() {
    return ApiService.fetchData(
        {
            url: PREFIX_PRUEBA + PREFIX_TESTER,
            method: 'GET'
        }
    );
}

export async function apiStoreTester(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_PRUEBA + PREFIX_TESTER,
            method: 'POST',
            data
        }
    );
}

export async function apiDeleteTester(id) {
    return ApiService.fetchData(
        {
            url: PREFIX_PRUEBA + PREFIX_TESTER + '/' + id,
            method: 'DELETE'
        }
    );
}