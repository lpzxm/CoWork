import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	setCurrentRouteTitle,
	setCurrentRouteSubtitle,
	setCurrentRouteInfo,
	setCurrentRouteOptions,
} from 'store/base/commonSlice'
import BasePage from 'components/template/BasePage'
import { Button } from 'components/custom'
import DataTable from 'components/custom/DataTable'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import {
	Drawer,
	FormContainer,
	FormItem,
	Input,
	Notification,
	Checkbox,
	Select,
	Tabs,
	Tag,
	toast,
} from 'components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi'
import {
	apiCreateRole,
	apiCreateUser,
	apiDeleteRole,
	apiDeleteUser,
	apiGetPermissions,
	apiGetRoles,
	apiGetUsers,
	apiSyncRolePermissions,
	apiSyncUserRoles,
	apiUpdateRole,
	apiUpdateUser,
} from 'services/PermissionService'
import { apiGetGenders, apiGetMaritalStatuses } from 'services/AdministrationService'

const userValidationSchema = Yup.object().shape({
	name: Yup.string().trim().required('El nombre es obligatorio.'),
	lastname: Yup.string().trim().required('El apellido es obligatorio.'),
	username: Yup.string().trim().required('El usuario es obligatorio.'),
	email: Yup.string().trim().email('Correo inválido.').required('El correo es obligatorio.'),
	genderId: Yup.number().nullable().required('El género es obligatorio.'),
	maritalStatusId: Yup.number().nullable().required('El estado civil es obligatorio.'),
	address: Yup.string().trim().required('La dirección es obligatoria.'),
})

const roleValidationSchema = Yup.object().shape({
	name: Yup.string().trim().required('El nombre del rol es obligatorio.'),
})

const Permission = () => {
	const dispatch = useDispatch()
	const [activeTab, setActiveTab] = useState('users')
	const [users, setUsers] = useState([])
	const [roles, setRoles] = useState([])
	const [genders, setGenders] = useState([])
	const [maritalStatuses, setMaritalStatuses] = useState([])
	const [permissions, setPermissions] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const [showUserForm, setShowUserForm] = useState(false)
	const [editingUserId, setEditingUserId] = useState(null)
	const [userFormValues, setUserFormValues] = useState({
		name: '',
		lastname: '',
		username: '',
		email: '',
		genderId: null,
		maritalStatusId: null,
		address: '',
		roleIds: [],
	})

	const [showRoleForm, setShowRoleForm] = useState(false)
	const [editingRoleId, setEditingRoleId] = useState(null)
	const [roleFormValues, setRoleFormValues] = useState({
		name: '',
		permissionIds: [],
	})

	const [confirmDelete, setConfirmDelete] = useState({
		open: false,
		type: null,
		id: null,
		label: '',
	})

	const handleChange = useCallback(() => {
		dispatch(setCurrentRouteTitle(''))
		dispatch(setCurrentRouteSubtitle(''))
		dispatch(setCurrentRouteInfo(''))
		dispatch(setCurrentRouteOptions(''))
	}, [dispatch])

	useEffect(() => {
		handleChange()
	}, [handleChange])

	const loadData = useCallback(async () => {
		setIsLoading(true)
		setError('')
		try {
			const [usersResponse, rolesResponse, permissionsResponse, gendersResponse, maritalStatusesResponse] = await Promise.all([
				apiGetUsers(),
				apiGetRoles(),
				apiGetPermissions(),
				apiGetGenders(),
				apiGetMaritalStatuses(),
			])

			setUsers(usersResponse?.data?.data ?? [])
			setRoles(rolesResponse?.data?.data ?? [])
			setPermissions(permissionsResponse?.data?.data ?? [])
			setGenders(gendersResponse?.data ?? [])
			setMaritalStatuses(maritalStatusesResponse?.data ?? [])
		} catch (err) {
			setError('No se pudo cargar la información de permisos.')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadData()
	}, [loadData])

	const roleOptions = useMemo(
		() => roles.map((role) => ({ value: role.id, label: role.name })),
		[roles]
	)

	const genderOptions = useMemo(
		() => genders.map((gender) => ({ value: gender.id, label: gender.name })),
		[genders]
	)

	const maritalStatusOptions = useMemo(
		() => maritalStatuses.map((maritalStatus) => ({ value: maritalStatus.id, label: maritalStatus.name })),
		[maritalStatuses]
	)

	const permissionColumns = useMemo(
		() => [
			{
				header: 'Permiso',
				accessorKey: 'description',
			},
			{
				header: 'Nombre técnico',
				accessorKey: 'name',
			},
			{
				header: 'Módulo',
				accessorKey: 'module',
			},
			{
				header: 'Guard',
				accessorKey: 'guard_name',
			},
			{
				header: 'Creado',
				accessorKey: 'created_at',
				cell: ({ row }) => {
					if (!row.original.created_at) return '-'
					const date = new Date(row.original.created_at)
					return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
				}
			}
		],
		[]
	)

	const permissionModules = useMemo(() => {
		const grouped = permissions.reduce((acc, permission) => {
			const permissionName = String(permission?.name || '').trim()
			const moduleKey = permissionName.includes('.')
				? permissionName.split('.')[0]
				: 'otros'

			if (!acc[moduleKey]) {
				acc[moduleKey] = []
			}

			acc[moduleKey].push(permission)
			return acc
		}, {})

		return Object.entries(grouped)
			.map(([module, modulePermissions]) => ({
				module,
				permissions: modulePermissions.sort((a, b) =>
					String(a?.name || '').localeCompare(String(b?.name || ''))
				),
			}))
			.sort((a, b) => a.module.localeCompare(b.module))
	}, [permissions])

	const openNotification = (type, title, message) => {
		const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
		toast.push(
			<Notification className={borderColor} title={title} type={type} duration={5000} closable>
				{message}
			</Notification>,
			{ placement: 'top-start' }
		)
	}

	const openUserNew = () => {
		setEditingUserId(null)
		setUserFormValues({
			name: '',
			lastname: '',
			username: '',
			email: '',
			genderId: null,
			maritalStatusId: null,
			address: '',
			roleIds: [],
		})
		setShowUserForm(true)
	}

	const openUserEdit = useCallback((user) => {
		const employee = user.employee || {}
		const addressText =
			employee.address?.address ||
			employee.adm_address?.address ||
			employee.address ||
			''
		setEditingUserId(user.id)
		setUserFormValues({
			name: user.name || '',
			lastname: user.lastname || '',
			username: user.username || '',
			email: user.email || '',
			genderId: employee.adm_gender_id || user.gender_id || null,
			maritalStatusId: employee.adm_marital_status_id || null,
			address: addressText,
			roleIds: (user.roles || []).map((role) => role.id),
		})
		setShowUserForm(true)
	}, [])

	const openRoleNew = () => {
		setEditingRoleId(null)
		setRoleFormValues({
			name: '',
			permissionIds: [],
		})
		setShowRoleForm(true)
	}

	const openRoleEdit = useCallback((role) => {
		if (role.name === 'super-admin') {
			openNotification('danger', 'Acción no permitida', 'No puedes editar el rol super-admin.')
			return
		}
		setEditingRoleId(role.id)
		setRoleFormValues({
			name: role.name || '',
			permissionIds: (role.permissions || []).map((perm) => perm.id),
		})
		setShowRoleForm(true)
	}, [])

	const handleSaveUser = async (values, { setSubmitting, setErrors }) => {
		setSubmitting(true)

		const payload = {
			name: values.name.trim(),
			lastname: values.lastname.trim(),
			username: values.username.trim(),
			email: values.email.trim(),
			genderId: values.genderId,
			maritalStatusId: values.maritalStatusId,
			address: values.address.trim(),
		}

		try {
			let targetId = editingUserId

			if (editingUserId) {
				await apiUpdateUser(editingUserId, payload)
			} else {
				const response = await apiCreateUser(payload)
				targetId = response?.data?.data?.id
			}

			if (targetId) {
				await apiSyncUserRoles(targetId, { roles: values.roleIds || [] })
			}

			openNotification(
				'success',
				'Éxito',
				editingUserId ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.'
			)

			await loadData()
			setShowUserForm(false)
		} catch (err) {
			console.log(err);
			
			const apiErrors = err?.response?.data?.errors
			if (apiErrors) {
				const fieldErrors = Object.keys(apiErrors).reduce((acc, key) => {
					const value = apiErrors[key]
					acc[key] = Array.isArray(value) ? value[0] : value
					return acc
				}, {})
				setErrors(fieldErrors)
			}

			openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar el usuario.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleSaveRole = async (values, { setSubmitting, setErrors }) => {
		setSubmitting(true)

		const payload = {
			name: values.name.trim(),
		}

		try {
			let targetId = editingRoleId

			if (editingRoleId) {
				await apiUpdateRole(editingRoleId, payload)
			} else {
				const response = await apiCreateRole(payload)
				targetId = response?.data?.data?.id
			}

			if (targetId) {
				await apiSyncRolePermissions(targetId, { permissions: values.permissionIds || [] })
			}

			openNotification(
				'success',
				'Éxito',
				editingRoleId ? 'Rol actualizado correctamente.' : 'Rol creado correctamente.'
			)

			await loadData()
			setShowRoleForm(false)
		} catch (err) {
			const apiErrors = err?.response?.data?.errors
			if (apiErrors) {
				const fieldErrors = Object.keys(apiErrors).reduce((acc, key) => {
					const value = apiErrors[key]
					acc[key] = Array.isArray(value) ? value[0] : value
					return acc
				}, {})
				setErrors(fieldErrors)
			}

			openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar el rol.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleDelete = async () => {
		try {
			if (confirmDelete.type === 'user') {
				await apiDeleteUser(confirmDelete.id)
				openNotification('success', 'Éxito', 'Usuario eliminado correctamente.')
			}

			if (confirmDelete.type === 'role') {
				await apiDeleteRole(confirmDelete.id)
				openNotification('success', 'Éxito', 'Rol eliminado correctamente.')
			}

			await loadData()
		} catch (err) {
			openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el registro.')
		} finally {
			setConfirmDelete({ open: false, type: null, id: null, label: '' })
		}
	}

	const userColumns = useMemo(
		() => [
			{
				header: 'Nombre',
				accessorFn: (row) => `${row.name || ''} ${row.lastname || ''}`.trim(),
				cell: ({ row }) => (
					<span>{`${row.original.name || ''} ${row.original.lastname || ''}`.trim()}</span>
				),
			},
			{
				header: 'Usuario',
				accessorKey: 'username',
			},
			{
				header: 'Correo',
				accessorKey: 'email',
			},
			{
				id: 'roles',
				header: 'Roles',
				accessorFn: (row) => (row.roles || []).map((role) => role.name).join(', '),
				cell: ({ row }) => {
					const roleList = row.original.roles || []
					if (!roleList.length) {
						return '-'
					}

					return (
						<div className="flex flex-wrap gap-2">
							{roleList.map((role) => (
								<Tag key={role.id} className="border-0 bg-slate-100 text-slate-600">
									{role.name}
								</Tag>
							))}
						</div>
					)
				},
			},
			{
				id: 'actions',
				header: 'Acciones',
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="solid"
							onClick={() => openUserEdit(row.original)}
							icon={<HiPencil />}
						/>
						<Button
							size="sm"
							variant="solid"
							color="danger"
							onClick={() =>
								setConfirmDelete({
									open: true,
									type: 'user',
									id: row.original.id,
									label: row.original.name,
								})
							}
							icon={<HiTrash />}
						/>
					</div>
				),
			},
		],
		[openUserEdit]
	)

	const roleColumns = useMemo(
		() => [
			{
				header: 'Nombre',
				accessorKey: 'name',
			},
			{
				id: 'permissions',
				header: 'Permisos',
				accessorFn: (row) => (row.permissions || []).map((perm) => perm.name).join(', '),
				cell: ({ row }) => {
					const permList = row.original.permissions || []
					return (
						<Tag className="border-0 bg-slate-100 text-slate-600">
							{permList.length} permisos
						</Tag>
					)
				},
			},
			{
				id: 'actions',
				header: 'Acciones',
				cell: ({ row }) => {
					const isSuperAdmin = row.original.name === 'super-admin'
					return (
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="solid"
								disabled={isSuperAdmin}
								onClick={() => openRoleEdit(row.original)}
								icon={<HiPencil />}
							/>
							<Button
								size="sm"
								variant="solid"
								color="danger"
								disabled={isSuperAdmin}
								onClick={() =>
									setConfirmDelete({
										open: true,
										type: 'role',
										id: row.original.id,
										label: row.original.name,
									})
								}
								icon={<HiTrash />}
							/>
						</div>
					)
				},
			},
		],
		[openRoleEdit]
	)

	return (
		<BasePage
			title="Permisos"
			subtitle="Administración de usuarios y roles"
			info="Crea usuarios, roles y asigna permisos para controlar el acceso al sistema."
		>
			<div className="p-4">
				{error && <div className="text-center text-red-600">{error}</div>}
				{!error && (
					<Tabs value={activeTab} onChange={setActiveTab} className="mt-2">
						<Tabs.TabList>
							<Tabs.TabNav value="users">Usuarios</Tabs.TabNav>
							<Tabs.TabNav value="roles">Roles</Tabs.TabNav>
							<Tabs.TabNav value="permissions">Permisos</Tabs.TabNav>
						</Tabs.TabList>
						<Tabs.TabContent value="users">
							<div className="mt-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Usuarios</h3>
								</div>
								<DataTable
									columns={userColumns}
									data={users}
									loading={isLoading}
									RightContent={
										<Button
											variant="solid"
											color="primary"
											onClick={openUserNew}
											icon={<HiPlusCircle className="text-2xl" />}
										>
											Nuevo usuario
										</Button>
									}
								/>
							</div>
						</Tabs.TabContent>
						<Tabs.TabContent value="roles">
							<div className="mt-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Roles</h3>
								</div>
								<DataTable
									columns={roleColumns}
									data={roles}
									loading={isLoading}
									RightContent={
										<Button
											variant="solid"
											color="primary"
											onClick={openRoleNew}
											icon={<HiPlusCircle className="text-2xl" />}
										>
											Nuevo rol
										</Button>
									}
								/>
							</div>
						</Tabs.TabContent>
						<Tabs.TabContent value="permissions">
							<div className="mt-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Permisos</h3>
									<span className="text-sm text-slate-500">Solo lectura</span>
								</div>
								<DataTable columns={permissionColumns} data={permissions} loading={isLoading} />
							</div>
						</Tabs.TabContent>
					</Tabs>
				)}

				<Formik
					enableReinitialize
					initialValues={userFormValues}
					validationSchema={userValidationSchema}
					onSubmit={handleSaveUser}
				>
					{({ touched, errors, values, setFieldValue, setFieldTouched, isSubmitting, submitForm }) => (
						<Drawer
							isOpen={showUserForm}
							onClose={() => setShowUserForm(false)}
							placement="right"
							closable
							title={
								<div>
									<h4>{editingUserId ? 'Editar usuario' : 'Nuevo usuario'}</h4>
									<p>Completa los datos del usuario</p>
								</div>
							}
							footer={
								<>
									<Button size="sm" variant="solid" color="secondary" onClick={() => setShowUserForm(false)}>
										Salir
									</Button>
									<Button size="sm" variant="solid" color="primary" onClick={submitForm} loading={isSubmitting}>
										Guardar
									</Button>
								</>
							}
						>
							<Form>
								<FormContainer>
									<div className="grid grid-cols-2 gap-4">
										<FormItem label="Nombre" invalid={errors.name && touched.name} errorMessage={errors.name}>
											<Field
												type="text"
												autoComplete="off"
												name="name"
												placeholder="Nombre"
												component={Input}
											/>
										</FormItem>
										<FormItem
											label="Apellido"
											invalid={errors.lastname && touched.lastname}
											errorMessage={errors.lastname}
										>
											<Field
												type="text"
												autoComplete="off"
												name="lastname"
												placeholder="Apellido"
												component={Input}
											/>
										</FormItem>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<FormItem
											label="Usuario"
											invalid={errors.username && touched.username}
											errorMessage={errors.username}
										>
											<Field
												type="text"
												autoComplete="off"
												name="username"
												placeholder="Usuario"
												component={Input}
											/>
										</FormItem>
										<FormItem label="Correo" invalid={errors.email && touched.email} errorMessage={errors.email}>
											<Field
												type="email"
												autoComplete="off"
												name="email"
												placeholder="Correo"
												component={Input}
											/>
										</FormItem>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<FormItem label="Género">
											<Select
												placeholder="Selecciona el género"
												value={genderOptions.find((option) => values.genderId === option.value)}
												options={genderOptions}
												onChange={(options) =>
													setFieldValue(
														'genderId',
														options ? options.value : null
													)
												}
												onBlur={() => setFieldTouched('genderId', true)}
											/>
										</FormItem>
										<FormItem label="Estado civil">
											<Select
												placeholder="Selecciona el estado civil"
												value={maritalStatusOptions.find((option) => values.maritalStatusId === option.value)}
												options={maritalStatusOptions}
												onChange={(options) =>
													setFieldValue(
														'maritalStatusId',
														options ? options.value : null
													)
												}
												onBlur={() => setFieldTouched('maritalStatusId', true)}
											/>
										</FormItem>
									</div>
									<FormItem label="Dirección">
										<Field
											textArea
                                        	rows={3}
											name="address"
											placeholder="Dirección"
											component={Input}
										/>
									</FormItem>
									<FormItem label="Roles">
										<Select
											isMulti
											closeMenuOnSelect={false}
											placeholder="Selecciona roles"
											value={roleOptions.filter((option) => values.roleIds.includes(option.value))}
											options={roleOptions}
											onChange={(options) =>
												setFieldValue(
													'roleIds',
													options ? options.map((option) => option.value) : []
												)
											}
											onBlur={() => setFieldTouched('roleIds', true)}
										/>
									</FormItem>
								</FormContainer>
							</Form>
						</Drawer>
					)}
				</Formik>

				<Formik
					enableReinitialize
					initialValues={roleFormValues}
					validationSchema={roleValidationSchema}
					onSubmit={handleSaveRole}
				>
					{({ touched, errors, values, setFieldValue, isSubmitting, submitForm }) => (
						<Drawer
							isOpen={showRoleForm}
							onClose={() => setShowRoleForm(false)}
							placement="right"
							closable
							title={
								<div>
									<h4>{editingRoleId ? 'Editar rol' : 'Nuevo rol'}</h4>
									<p>Define el nombre y permisos del rol</p>
								</div>
							}
							footer={
								<>
									<Button size="sm" variant="solid" color="secondary" onClick={() => setShowRoleForm(false)}>
										Salir
									</Button>
									<Button size="sm" variant="solid" color="primary" onClick={submitForm} loading={isSubmitting}>
										Guardar
									</Button>
								</>
							}
						>
							<Form>
								<FormContainer>
									<FormItem label="Nombre" invalid={errors.name && touched.name} errorMessage={errors.name}>
										<Field
											type="text"
											autoComplete="off"
											name="name"
											placeholder="Nombre del rol"
											component={Input}
										/>
									</FormItem>
									<FormItem label="Permisos">
										{(() => {
											const selectedPermissionIds = values.permissionIds || []
											const selectedSet = new Set(selectedPermissionIds)
											const allPermissionIds = permissions.map((perm) => perm.id)
											const allSelected =
												allPermissionIds.length > 0 &&
												allPermissionIds.every((id) => selectedSet.has(id))

											const toggleAllPermissions = (nextChecked) => {
												setFieldValue('permissionIds', nextChecked ? allPermissionIds : [])
											}

											const toggleModulePermissions = (modulePermissionIds, nextChecked) => {
												if (nextChecked) {
													const merged = new Set([...selectedPermissionIds, ...modulePermissionIds])
													setFieldValue('permissionIds', Array.from(merged))
													return
												}

												const moduleIds = new Set(modulePermissionIds)
												setFieldValue(
													'permissionIds',
													selectedPermissionIds.filter((id) => !moduleIds.has(id))
												)
											}

											const toggleSinglePermission = (permissionId, nextChecked) => {
												if (nextChecked) {
													setFieldValue('permissionIds', [...selectedPermissionIds, permissionId])
													return
												}

												setFieldValue(
													'permissionIds',
													selectedPermissionIds.filter((id) => id !== permissionId)
												)
											}

											return (
												<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
													<div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
														<Checkbox checked={allSelected} onChange={toggleAllPermissions}>
															<span className="font-semibold text-slate-700">Todos los permisos</span>
														</Checkbox>
														<span className="text-xs text-slate-500">
															{selectedPermissionIds.length}/{allPermissionIds.length}
														</span>
													</div>

													<div className="space-y-3 max-h-80 overflow-y-auto pr-1">
														{permissionModules.map((moduleGroup) => {
															const modulePermissionIds = moduleGroup.permissions.map((perm) => perm.id)
															const selectedInModule = modulePermissionIds.filter((id) => selectedSet.has(id)).length
															const moduleSelected =
																modulePermissionIds.length > 0 &&
																modulePermissionIds.every((id) => selectedSet.has(id))

															return (
																<div key={moduleGroup.module} className="rounded-md border border-slate-200 bg-white p-3">
																	<div className="mb-2 flex items-center justify-between">
																		<Checkbox
																			checked={moduleSelected}
																			onChange={(nextChecked) =>
																				toggleModulePermissions(modulePermissionIds, nextChecked)
																			}
																		>
																			<span className="font-medium uppercase tracking-wide text-slate-700">
																				{moduleGroup.module}
																			</span>
																		</Checkbox>
																		<span className="text-xs text-slate-500">
																			{selectedInModule}/{modulePermissionIds.length}
																		</span>
																	</div>

																	<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
																		{moduleGroup.permissions.map((permission) => (
																			<Checkbox
																				key={permission.id}
																				checked={selectedSet.has(permission.id)}
																				onChange={(nextChecked) =>
																					toggleSinglePermission(permission.id, nextChecked)
																				}
																			>
																				<span className="text-sm text-slate-600">{permission.name}</span>
																			</Checkbox>
																		))}
																	</div>
																</div>
															)
														})}
													</div>
												</div>
											)
										})()}
									</FormItem>
								</FormContainer>
							</Form>
						</Drawer>
					)}
				</Formik>

				<ConfirmDialog
					isOpen={confirmDelete.open}
					title={`Eliminar ${confirmDelete.type === 'role' ? 'rol' : 'usuario'}`}
					type="danger"
					cancelText="Cancelar"
					confirmText="Eliminar"
					onCancel={() => setConfirmDelete({ open: false, type: null, id: null, label: '' })}
					onConfirm={handleDelete}
				>
					Esta acción no se puede deshacer.
				</ConfirmDialog>
			</div>
		</BasePage>
	)
}

export default Permission
