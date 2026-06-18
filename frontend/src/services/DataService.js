import ApiService from "./ApiService"

export async function apiGetData(params=null,url)
{
    return ApiService.fetchData(
    {
        url: url,
        method: 'GET',
        params
    });
}