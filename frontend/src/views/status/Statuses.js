import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
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
import StatusFormDrawer from './components/StatusFormDrawer'
import { HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi'
import {
    apiGetStatuses,
    apiCreateStatus,
    apiUpdateStatus,
    apiDeleteStatus,
} from 'services/StatusService'
import * as Yup from 'yup'

const COLOR_OPTIONS = [
    { label: 'Azul', value: '#3B82F6' },
    { label: 'Esmeralda', value: '#10B981' },
    { label: 'Naranja', value: '#F97316' },
    { label: 'Rojo', value: '#EF4444' },
    { label: 'Violeta', value: '#8B5CF6' },
    { label: 'Amarillo', value: '#EAB308' },
    { label: 'Rosa', value: '#EC4899' },
    { label: 'Cian', value: '#06B6D4' },
    { label: 'Gris', value: '#64748B' },
]

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Ingresa el nombre del estado'),
    color: Yup.string().required('Selecciona un color'),
    active: Yup.boolean(),
})

const resolvePaletteColor = (value) => value || '#3B82F6'

const Statuses = () => {
    const dispatch = useDispatch()
    const [statuses, setStatuses] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formValues, setFormValues] = useState({
        name: '',
        color: COLOR_OPTIONS[0].value,
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

    const normalizeStatus = useCallback((status) => {
        return {
            id: status.id,
            name: status.name,
            color: status.color || '#3B82F6',
            active: Boolean(status.active),
        }
    }, [])

    const loadStatuses = useCallback(async () => {
        setIsLoading(true)
        setLoadError('')
        try {
            const response = await apiGetStatuses()
            const data = response?.data?.data ?? []
            setStatuses(data.map(normalizeStatus))
        } catch (err) {
            setLoadError('No se pudieron cargar los estados.')
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [normalizeStatus])

    useEffect(() => {
        loadStatuses()
    }, [loadStatuses])

    const openNew = () => {
        setEditing(null)
        setFormValues({
            name: '',
            color: COLOR_OPTIONS[0].value,
            active: true,
        })
        setShowForm(true)
    }

    const openEdit = useCallback((st) => {
        setEditing(st.id)
        setFormValues({
            name: st.name,
            color: resolvePaletteColor(st.color),
            active: st.active,
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
                header: 'Color',
                accessorKey: 'color',
                cell: ({ row }) => (
                    <Tag
                        prefix={
                            <span
                                className="tag-affix tag-prefix"
                                style={{ backgroundColor: row.original.color }}
                            />
                        }
                    >
                        {row.original.name}
                    </Tag>
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
                        <Button
                            size="sm"
                            variant="solid"
                            color="danger"
                            onClick={() => setConfirmDelete({ open: true, id: row.original.id })}
                            icon={<HiTrash />}
                        />
                    </div>
                ),
            },
        ],
        [openEdit]
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
            color: values.color,
            active: values.active,
        }

        setSubmitting(true)
        try {
            if (editing) {
                const resp = await apiUpdateStatus(editing, payload)
                const updated = resp?.data?.data
                if (updated) {
                    setStatuses((prev) =>
                        prev.map((s) => (s.id === editing ? normalizeStatus(updated) : s))
                    )
                }
                openNotification('success', 'Éxito', 'Estado actualizado correctamente')
            } else {
                const resp = await apiCreateStatus(payload)
                const created = resp?.data?.data
                if (created) {
                    setStatuses((prev) => [normalizeStatus(created), ...prev])
                }
                openNotification('success', 'Éxito', 'Estado creado correctamente')
            }

            setEditing(null)
            setFormValues({ name: '', color: COLOR_OPTIONS[0].value, active: true })
            setShowForm(false)
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

            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar el estado.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiDeleteStatus(id)
            setStatuses((prev) => prev.filter((s) => s.id !== id))
            openNotification('success', 'Éxito', 'Estado eliminado correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el estado.')
        } finally {
            setConfirmDelete({ open: false, id: null })
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Estados</h3>
            </div>

            {loadError && <div className="text-center text-red-600">{loadError}</div>}
            {!loadError && (
                <DataTable
                    columns={columns}
                    data={statuses}
                    loading={isLoading}
                    RightContent={
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={openNew}
                            icon={<HiPlusCircle className="text-2xl" />}
                        >
                            Nuevo estado
                        </Button>
                    }
                />
            )}

            <StatusFormDrawer
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                editing={editing}
                formValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSave}
            />

            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Eliminar estado"
                type="danger"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
            >
                Esta acción no se puede deshacer. Si el estado tiene tareas o subtareas asociadas, no se podrá eliminar.
            </ConfirmDialog>
        </div>
    )
}

export default Statuses
