import ApiService from './ApiService'

export async function apiGetHolidays() {
    return ApiService.fetchData({ url: 'attendance/holidays', method: 'GET' })
}

export async function apiGetHolidaysBetweenDates(dateIni,dateEnd) {
    return ApiService.fetchData({ url: 'attendance/holidays/between-dates/date-ini/'+dateIni+'/date-end/'+dateEnd, method: 'GET' })
}

export async function apiGetDatesWithHolidays(dateIni,dateEnd) {
    return ApiService.fetchData({ url: 'attendance/holidays/dates/date-ini/'+dateIni+'/date-end/'+dateEnd, method: 'GET' })
}