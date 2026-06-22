import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Button } from 'components/custom'
import { Notification, toast } from 'components/ui'
import Tag from 'components/ui/Tag'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import DataTable from 'components/custom/DataTable'
import { HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi'
import {
    apiGetUsers,
    apiCreateUser,
    apiUpdateUser,
    apiDeleteUser,
} from 'services/UserService'
import * as Yup from 'yup'
import UserFormDrawer from './components/UserFormDrawer'

const ROLE_OPTIONS = [
    { label: 'Super Admin', value: 'super-admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Coordinador', value: 'coordinador' },
]

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('El nombre es obligatorio'),
    email: Yup.string().trim().email('Correo inválido').required('El correo es obligatorio'),
    role: Yup.string().required('Selecciona un rol'),
    active: Yup.boolean(),
})

const Users = () => {
    const dispatch = useDispatch()
    const currentAuthority = useSelector((state) => state.auth.user.authority)
    const currentUserId = useSelector((state) => state.auth.user.id)
    const isSuperAdmin = currentAuthority.includes('super-admin')

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        role: 'coordinador',
        active: true,
    })
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null })

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle(''))
        dispatch(setCurrentRouteSubtitle(''))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
    }, [handleChange])

    const normalizeUser = useCallback((user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            active: Boolean(user.active),
            role: (user.roles && user.roles[0]) || '',
            roleList: user.roles || [],
        }
    }, [])

    const loadUsers = useCallback(async () => {
        setIsLoading(true)
        setLoadError('')
        try {
            const response = await apiGetUsers()
            const data = response?.data?.data ?? []
            setUsers(data.map(normalizeUser))
        } catch (err) {
            setLoadError('No se pudieron cargar los usuarios.')
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [normalizeUser])

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const roleOptions = useMemo(() => {
        if (isSuperAdmin) return ROLE_OPTIONS
        return ROLE_OPTIONS.filter((r) => r.value === 'coordinador')
    }, [isSuperAdmin])

    const openNew = () => {
        setEditing(null)
        setFormValues({
            name: '',
            email: '',
            role: 'coordinador',
            active: true,
        })
        setShowForm(true)
    }

    const openEdit = useCallback((u) => {
        setEditing(u.id)
        setFormValues({
            name: u.name,
            email: u.email,
            role: u.role || 'coordinador',
            active: u.active,
        })
        setShowForm(true)
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Nombre',
                accessorKey: 'name',
            },
            {
                header: 'Correo',
                accessorKey: 'email',
            },
            {
                header: 'Rol',
                accessorKey: 'role',
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.roleList.map((r) => (
                            <Tag key={r} className="border-0 bg-slate-100 text-slate-600">
                                {r}
                            </Tag>
                        ))}
                        {!row.original.roleList.length && <span className="text-slate-400">-</span>}
                    </div>
                ),
            },
            {
                header: 'Activo',
                accessorKey: 'active',
                cell: ({ row }) => (
                    <Tag className={`border-0 ${row.original.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {row.original.active ? 'Sí' : 'No'}
                    </Tag>
                ),
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="solid" onClick={() => openEdit(row.original)} icon={<HiPencil />} />
                        {Number(row.original.id) !== Number(currentUserId) && (
                            <Button
                                size="sm"
                                variant="solid"
                                color="danger"
                                onClick={() => setConfirmDelete({ open: true, id: row.original.id })}
                                icon={<HiTrash />}
                            />
                        )}
                    </div>
                ),
            },
        ],
        [openEdit, currentUserId]
    )

    const openNotification = (type, title, message) => {
        const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
        toast.push(
            <Notification className={borderColor} title={title} type={type} duration={5000} closable>
                {message}
            </Notification>,
            { placement: 'top-start' }
        )
    }

    const handleSave = async (values, { setSubmitting, setErrors }) => {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            role: values.role,
            active: values.active,
        }

        setSubmitting(true)
        try {
            if (editing) {
                const resp = await apiUpdateUser(editing, payload)
                const updated = resp?.data?.data
                if (updated) {
                    setUsers((prev) =>
                        prev.map((u) => (u.id === editing ? normalizeUser(updated) : u))
                    )
                }
                openNotification('success', 'Éxito', 'Usuario actualizado correctamente')
            } else {
                const resp = await apiCreateUser(payload)
                const created = resp?.data?.data
                if (created) {
                    setUsers((prev) => [normalizeUser(created), ...prev])
                }
                openNotification('success', 'Éxito', 'Usuario creado correctamente. Se le envió un correo de bienvenida.')
            }

            setEditing(null)
            setFormValues({ name: '', email: '', role: 'coordinador', active: true })
            setShowForm(false)
        } catch (err) {
            const apiErrors = err?.response?.data?.errors;
            let customMessage = err?.response?.data?.message || 'No se pudo guardar el usuario.'
            if (apiErrors) {
                const fieldErrors = Object.keys(apiErrors).reduce((acc, key) => {
                    const value = apiErrors[key]
                    acc[key] = Array.isArray(value) ? value[0] : value
                    return acc
                }, {});
                setErrors(fieldErrors)

                const firstError = Object.values(apiErrors)[0];
                if(Array.isArray(firstError) && firstError.length > 0) {
                    customMessage = firstError[0];
                }
            }

            openNotification('danger', 'Error', customMessage);
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiDeleteUser(id)
            setUsers((prev) => prev.filter((u) => u.id !== id))
            openNotification('success', 'Éxito', 'Usuario eliminado correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el usuario.')
        } finally {
            setConfirmDelete({ open: false, id: null })
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Usuarios</h3>
            </div>

            <DataTable
                columns={columns}
                data={users}
                loading={isLoading}
                RightContent={
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={openNew}
                        icon={<HiPlusCircle className="text-2xl" />}
                    >
                        Nuevo usuario
                    </Button>
                }
            />
            {loadError && <div className="text-center text-red-600 mt-4">{loadError}</div>}

            <UserFormDrawer
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                editing={editing}
                formValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSave}
                roleOptions={roleOptions}
            />

            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Eliminar usuario"
                type="danger"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
            >
                Esta acción no se puede deshacer. Si el usuario tiene tareas o subtareas asociadas, no se podrá eliminar.
            </ConfirmDialog>
        </div>
    )
}

export default Users
