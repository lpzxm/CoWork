import ApiService from "./ApiService";

const PREFIX_COMPLAINTS = '/complaints';
const PREFIX_ATTACH_COMPLAINTS = '/attachments';
const PREFIX_STEPS_ALL = '/responses-steps-all';
const PREFIX_STEPS = '/steps';
const PREFIX_STEPS_COMPLAINTS = '/responses-steps';
const PREFIX_RESPONSES = '/responses';
const PREFIX_COMMENTS = '/comments';


export async function apiGetComplaints(filters, page, perPage, exportAll = false) {
  return ApiService.fetchData({
    url: PREFIX_COMPLAINTS,
    method: 'GET',
    params: {
      ...filters,
      page,
      per_page: perPage,
      ...(exportAll ? { export: 1 } : {}),   // <-- only when required
    },
  });
}

export async function apiGetComplaintById(id) {
    return ApiService.fetchData({
        url: PREFIX_COMPLAINTS+"/"+ id,
        method: 'GET'
    });
}

export async function apiGetGrievanceTypes() {
    return ApiService.fetchData({
        url: PREFIX_COMPLAINTS + "/grievance-types",
        method: 'GET'
    });
}

export async function apiStoreComplaints(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS,
            method: 'POST',
            data
        }
    );
}

export async function apiDeleteComplaints(id) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS+ '/' + id,
            method: 'DELETE'
        }
    );
}

export async function apiDeleteComplaintAttachment(id) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS+ PREFIX_ATTACH_COMPLAINTS + '/'+ id,
            method: 'DELETE'
        }
    );
}

export async function apiGetComplaintStepsAll() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_STEPS_ALL,
            method: 'GET'
        }
    );
}

export async function apiGetStepsByFunctionalPosition() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_STEPS+'/by-functional-position',
            method: 'GET'
        }
    );
}

export async function apiGetComplaintSteps() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_STEPS_COMPLAINTS,
            method: 'GET'
        }
    );
}

export async function apiStoreComplaintResponse(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_RESPONSES,
            method: 'POST',
            data
        }
    );
}

export async function apiMassAssignment(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/mass-assignment',
            method: 'POST',
            data
        }
    );
}

export async function apiMassCancel(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/mass-cancel',
            method: 'POST',
            data
        }
    );
}

export async function apiDownloadFile(id,fileName='file'){
    const response = await ApiService.fetchData({
        url: '/complaints/attachments/' + id,
        method: 'GET',
        responseType: 'blob'
    });

    const contentDisposition = response.headers['content-disposition'];
    const fileNameDownload = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : fileName;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileNameDownload);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export async function apiGetComplaintInspections() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/inspections',
            method: 'GET'
        }
    );
}

export async function apiGetComplaintsCalendar() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/complaints-calendar',
            method: 'GET'
        }
    );
}

export async function apiStoreComplaintComment(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_COMMENTS,
            method: 'POST',
            data
        }
    );
}

export async function apiCancelComplaint(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/cancel',
            method: 'POST',
            data
        }
    );
}

export async function apiChangeStep(data) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/change-step',
            method: 'POST',
            data
        }
    );
}

export async function apiDeleteComplaintComment(id) {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + PREFIX_COMMENTS + '/' + id,
            method: 'DELETE'
        }
    );
}

export async function apiGetEmployeesWithComplaints() {
    return ApiService.fetchData(
        {
            url: PREFIX_COMPLAINTS + '/employees',
            method: 'GET'
        }
    );
}