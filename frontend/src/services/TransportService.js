import ApiService from "./ApiService";

//--------------------------------------------- CRUD Requests -------------------------------------------
// Obtener todas las solicitudes de transporte
export async function apiGetTransports(params=null) {
  return ApiService.fetchData({
    url: 'transport/requests',
    method: 'GET',
    params
  });
}

// Obtener todas las solicitudes de transporte
export async function apiGetTransportsAdmin(params=null) {
  return ApiService.fetchData({
    url: 'transport/requestsAdmin',
    method: 'GET',
    params
  });
}


// Obtener un registro de transporte por su ID
export async function apiGetTransportById(id) {
  return ApiService.fetchData({
    url: `transport/requestBy/${id}`,
    method: 'GET',
  });
}

// Guardar un registro de transporte (crear)
export async function apiCreateTransport(data) {
  return ApiService.fetchData({
    url: 'transport/request',
    method: 'POST',
    data,
  });
}

// Actualizar un registro de transporte por su ID
export async function apiUpdateTransport(id, data) {
  return ApiService.fetchData({
    url: `transport/requestUpd/${id}`,
    method: 'PATCH',
    data,
  });
}

// Para actualizar el campo cancelacion

export async function apiUpdateTransportCancelation(id, cancelation) {
  return ApiService.fetchData({
    url: `transport/updateTransportCancellation/${id}`,
    method: 'PATCH',
    data: { cancelation },
  });
}

// Para mostrar todas las aprobaciones en el calendario

export async function apiGetRequestCalendar(params=null) {
  return ApiService.fetchData({
    url: 'transport/requests-calendar',
    method: 'GET',
    params
  });
}


//--------------------------------------------- change status request -------------------------------------------

//Para upd el estado de la solicitud
export async function apiUpdateTransportStatus(transportId, newStatus) {
  return ApiService.fetchData({
    url: `transport/approveTransport/${transportId}`,
    method: 'PUT',
    data: { status: newStatus }, 
  });
}

// Borrar un registro de transporte por su ID
export async function apiDeleteTransport(id) {
  return ApiService.fetchData({
    url: `transport/requestDel/${id}`,
    method: 'DELETE',
  });
}

// // Cancelar una solicitud de transporte por su ID
// export async function apiCancelTransport(id) {
//   return ApiService.fetchData({
//     url: `transport/cancelTransport/${id}`,
//     method: 'PUT', 
//   });
// }


// Cancelar una solicitud de transporte por su ID
export async function apiCancelTransport(id) {
  try {
    const response = await ApiService.fetchData({
      url: `transport/cancelTransport/${id}`,
      method: 'PUT',
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// rechazar una solicitud de transporte por su ID
export async function apiRejectTransport(id) {
  try {
    const response = await ApiService.fetchData({
      url: `transport/rejectTransport/${id}`,
      method: 'PUT',
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// Guardar un registro de transporte (crear??) -----------------> validar este endPoint
export async function apiStoreRequest(data) {
  let url = 'transport/request';
  let method = 'POST';

  if (data.id) {
      url = 'transport/request/' + data.id;
      method = 'PATCH';
  }

  return ApiService.fetchData({
      url: url,
      method: method,
      data
  });
}

//--------------------------------------------- Lista de departamentos ------------------------------------------- 
export async function apiGetDepartments() {
  return ApiService.fetchData({
    url: 'transport/departments',
    method: 'GET',
  });
}

//--------------------------------------------- Lista de municipios -------------------------------------------
// Lista de municipios por departamento
export async function apiGetMunicipalitiesByDepartment(adm_department_id) {
  return ApiService.fetchData({
    //url: `transport/department/${departmentId}/municipalities`, 
    url: `administration/municipalities${adm_department_id}`, 
    method: 'GET',
  });
}

//--------------------------------------------- Lista de drivers -------------------------------------------
// Obtener la lista de conductores
export async function apiGetDrivers() {
  return ApiService.fetchData({
    url: 'transport/drivers', 
    method: 'GET',
  });
}

// Obtener un conductor por su ID
export async function apiGetDriverById(id) {
  return ApiService.fetchData({
    url: `transport/driver/${id}`,
    method: 'GET',
  });
}

//--------------------------------------------- CRUD de vehicles -------------------------------------------
// Obtener la lista de vehiculos
export async function apiGetVehicles() {
  return ApiService.fetchData({
    url: 'transport/vehicles',
    method: 'GET',
  });
}

// Obtener la lista de vehiculos sin paginación
export async function apiGetVehiclesAll() {
  return ApiService.fetchData({
    url: 'transport/vehiclesAll',
    method: 'GET',
  });
}

//Guardar registro de un vehiculo
export async function apiStoreVehicle(data) {
  return ApiService.fetchData({
    url: 'transport/store-vehicle',
    method: 'POST',
    data,
  });
}

//obtener vehiculo por id
export async function apiGetVehicleById(id) {
  return ApiService.fetchData({
    url: `transport/vehicleBy/${id}`,
    method: 'GET',
  });
}

//actualizar registro de un vehiculo
export async function apiUpdateVehicle(id, data) {
  return ApiService.fetchData({
    url: `transport/vehicleUpd/${id}`,
    method: 'PATCH',
    data,
  });
}


//borrar el vehiculo registrado
export async function apiDeleteVehicle(id) {
  return ApiService.fetchData({
    url: `transport/vehicleDel/${id}`,
    method: 'DELETE',
  });
}

//--------------------------------------------- CRUD de assignment vehicle -------------------------------------------

// Crear una asignación de vehículo
export async function apiCreateVehicleAssignment(vehicleId, driverId, observations) {
  return ApiService.fetchData({
    url: 'transport/vehicle-store-assignments',
    method: 'POST',
    data: {
      vehicle_id: vehicleId,
      driver_id: driverId,
      observations: observations,
    },
  });
}

//Obtener todas las asignaciones disponibles
export async function apiGetAllVehicleAssignments() {
  return ApiService.fetchData({
    url: 'transport/vehicle-assignments-all',
    method: 'GET',
  });
}

// Obtener todas las asignaciones de vehículos
export async function apiGetVehicleAssignments() {
  return ApiService.fetchData({
    url: 'transport/vehicle-assignments',
    method: 'GET',
  });
}

// Admin Obtener todas las asignaciones de vehículos
export async function apiGetAdminVehicleAssignments() {
  return ApiService.fetchData({
    url: 'transport/index-vehicle-assignments',
    method: 'GET',
  });
}

// Obtener todas las asignaciones false
export async function apiGetVehicleAssignmentsfalse() {
  return ApiService.fetchData({
    url: 'transport/vehicle-assignments-false',
    method: 'GET',
  });
}

// Obtener una asignación de vehículo por ID
export async function apiGetVehicleAssignmentById(id) {
  return ApiService.fetchData({
    url: `transport/vehicle-show-assignments/${id}`,
    method: 'GET',
  });
}

// Obtener driver y vehicle por ID
export async function apiGetAssignIds(id) {
  return ApiService.fetchData({
    url: `transport/assignments-driver-vehicle/${id}`,
    method: 'GET',
  });
}

// servicio para añadir una nueva asignación con status 0
export async function apiUpdateStatusAssg(vehicleId, driverId) {
  return ApiService.fetchData({
    url: `transport/update-vehicle-status`,
    method: 'PUT',
    data: {
      vehicle_id: vehicleId,
      driver_id: driverId,
    },
  });
}

// servicio para sustituir una  asignación con status de 1 a 0
export async function apiUpdateAssignmentStatus(vehicleId, driverId) {
  return ApiService.fetchData({
    url: `transport/update-assignment-status`, 
    method: 'PUT',
    data: {
      vehicle_id: vehicleId,
      driver_id: driverId,
    },
  });
}

// Actualizar una asignación de vehículo por ID
export async function apiUpdateVehicleAssignment(id, vehicleId, driverId) {
  return ApiService.fetchData({
    url: `transport/vehicle-upd-assignments/${id}`,
    method: 'PUT',
    data: {
      vehicle_id: vehicleId,
      driver_id: driverId,
    },
  });
}

// Borrar una asignación de vehículo por ID
export async function apiDeleteVehicleAssignment(id) {
  return ApiService.fetchData({
    url: `transport/vehicle-del-assignments/${id}`,
    method: 'DELETE',
  });
}

//--------------------------------------------- CRUD de trip types -------------------------------------------

//guarda un registro de tipo de viaje
export async function apiCreateTripType(data) {
  return ApiService.fetchData({
    url: 'transport/storeTripTypes',
    method: 'POST',
    data,
  });
}

//Muestra el listado de tipo de viaje
export async function apiGetTripTypes() {
  return ApiService.fetchData({
    url: 'transport/getTripTypes',
    method: 'GET',
  });
}

//Muestra un registro de tipo de viaje por ID
export async function apiGetTripTypeById(id) {
  return ApiService.fetchData({
    url: `transport/getTripTypes/${id}`,
    method: 'GET',
  });
}

/// Actualiza un registro de tipo de viaje
export async function apiUpdateTripType(id, data) {
  return ApiService.fetchData({
    url: `transport/PutTripTypes/${id}`,
    method: 'PUT',
    data,
  });
}

//Elmina un registro de tipo de viaje
export async function apiDeleteTripType(id) {
  return ApiService.fetchData({
    url: `transport/delTripTypes/${id}`,
    method: 'DELETE',
  });
}

//--------------------------------------------- CRUD de asignaciones a solicitudes -------------------------------------------

// Crea una asignación de vehículo
export async function apiCreateAssignment(transportId, vehicleId, driverId, observations) {
  return ApiService.fetchData({
    url: 'transport/assignmentStore',
    method: 'POST',
    data: {
      transport_id: transportId,
      vehicle_id: vehicleId,
      driver_id: driverId,
      observations: observations,
    },
  });
}

// Muestra todas las asignaciones 
export async function apiGetAssignments() {
  return ApiService.fetchData({
    url: 'transport/assignmentIndex',
    method: 'GET',
  });
}
// Muestra todas las asignaciones array
export async function apiGetAssignmentsArray() {
  return ApiService.fetchData({
    url: 'transport/assignments-array',
    method: 'GET',
  });
}

// Muestra una asignación por su ID
export async function apiGetAssignmentById(transport_id) {
  return ApiService.fetchData({
    url: `transport/assignmentShowBy/${transport_id}`,
    method: 'GET',
  });
}

// Muestra una asignación por su driver_ID
export async function apiGetAssignmentByDriverId(driverId) {
  return ApiService.fetchData({
    url: `transport/showByDriver/${driverId}`,
    method: 'GET',
  });
}

// Actualiza una asignación por su ID
export async function apiUpdateAssignment(transport_id, cancelation) {
  return ApiService.fetchData({
    url: `transport/assignmentUpdBy/${transport_id}`,
    method: 'PUT',
    data: {
      cancelation: cancelation
    },
  });
}

// Elimina una asignación por su ID
export async function apiDeleteAssignment(transport_id) {
  return ApiService.fetchData({
    url: `transport/assignmentDelBy/${transport_id}`,
    method: 'DELETE',
  });
}

export async function apiGetObsAndCancel() {
  return ApiService.fetchData({
    url: `transport/assignmentobsAndCancel`,
    method: 'GET',
  });
}

//-------------------------------------------- CRUD vehicle_type----------------------------------------
// Obtener todos los tipos de vehículos
export async function apiGetVehicleTypes(params=null) {
  return ApiService.fetchData({
    url: 'transport/vehicleTypes',
    method: 'GET',
    params
  });
}

// Obtener un tipo de vehículo por su ID
export async function apiGetVehicleTypeById(id) {
  return ApiService.fetchData({
    url: `transport/vehicleType/${id}`,
    method: 'GET',
  });
}

// Crear un nuevo tipo de vehículo
export async function apiCreateVehicleType(data) {
  return ApiService.fetchData({
    url: 'transport/vehicleType',
    method: 'POST',
    data,
  });
}

// Actualizar un tipo de vehículo por su ID
export async function apiUpdateVehicleType(id, data) {
  return ApiService.fetchData({
    url: `transport/vehicleType/${id}`,
    method: 'PATCH',
    data,
  });
}

// Eliminar un tipo de vehículo por su ID
export async function apiDeleteVehicleType(id) {
  return ApiService.fetchData({
    url: `transport/vehicleType/${id}`,
    method: 'DELETE',
  });
}
