import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
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
import { HiPlusCircle, HiPencil, HiTrash, HiCheck, HiX } from 'react-icons/hi'
import * as Yup from 'yup'
import {
    apiGetTasks,
    apiCreateTask,
    apiUpdateTask,
    apiDeleteTask,
    apiRequestReview,
    apiApproveReview,
} from 'services/TodoService'
import { apiGetStatuses } from 'services/StatusService'
import { apiGetUsers } from 'services/UserService'
import { apiUploadFile, apiDeleteFile, apiDownloadFile } from 'services/FileService'
import ReviewConfirmDialog from './components/ReviewConfirmDialog'
import TaskFormDrawer from './components/TaskFormDrawer'

const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required('El título es obligatorio.'),
    description: Yup.string().nullable(),
    status_id: Yup.number().nullable(),
    dt_delivery_limit: Yup.date().nullable(),
})

const Tasks = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentAuthority = useSelector((state) => state.auth.user.authority)
    const isAdmin = currentAuthority.some((r) => ['super-admin', 'admin'].includes(r))

    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [statuses, setStatuses] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        status_id: null,
        dt_delivery_limit: null,
        coordinators_ids: [],
    })
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null })
    const [confirmReviewAction, setConfirmReviewAction] = useState({ open: false, id: null, action: null, observation: '' })
    const [selectedFiles, setSelectedFiles] = useState([])
    const [deletingFileId, setDeletingFileId] = useState(null)

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle(''))
        dispatch(setCurrentRouteSubtitle(''))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
    }, [handleChange])

    const statusColorMap = useMemo(() => {
        const map = {}
        statuses.forEach((s) => { map[s.id] = s.color })
        return map
    }, [statuses])

    const normalizeTask = useCallback((task) => {
        const sid = task.status?.id ?? null
        return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            created_at: task.created_at || '',
            status_id: sid,
            status_name: task.status?.name || '',
            dt_delivery_limit: task.dt_delivery_limit || '',
            created_by: task.created_by || null,
            coordinators_assigned: task.coordinators_assigned || [],
            files: task.files || [],
            hasFiles: Array.isArray(task.files) && task.files.length > 0,
            hasSubtasks: Array.isArray(task.subtasks),
        }
    }, [])

    const loadData = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const [taskResponse, statusResponse] = await Promise.all([
                apiGetTasks(),
                apiGetStatuses(),
            ])

            const taskData = taskResponse?.data?.data ?? []
            const statusData = statusResponse?.data?.data ?? []

            setTasks(taskData.map(normalizeTask))
            setStatuses(statusData)

            if (isAdmin) {
                const userResponse = await apiGetUsers()
                setUsers(userResponse?.data?.data ?? [])
            } else {
                setUsers([])
            }
        } catch (err) {
            console.log(err)
            setError('No se pudieron cargar las tareas.')
        } finally {
            setIsLoading(false)
        }
    }, [normalizeTask, isAdmin])

    useEffect(() => {
        loadData()
    }, [loadData])

    const coordinatorOptions = useMemo(() => {
        return users
            .filter((u) => {
                const roles = u.roles || []
                return roles.includes('coordinador')
            })
            .map((u) => ({ value: u.id, label: u.name }))
    }, [users])

    const statusOptions = useMemo(() => {
        return statuses.map((s) => ({ value: s.id, label: s.name }))
    }, [statuses])

    const openNew = () => {
        setEditing(null)
        setFormValues({
            title: '',
            description: '',
            status_id: null,
            dt_delivery_limit: null,
            coordinators_ids: [],
        })
        setSelectedFiles([])
        setShowForm(true)
    }

    const openEdit = useCallback((task) => {
        setEditing(task.id)
        setFormValues({
            title: task.title,
            description: task.description || '',
            status_id: task.status_id,
            dt_delivery_limit: task.dt_delivery_limit
                ? dayjs(task.dt_delivery_limit).toDate()
                : null,
            coordinators_ids: task.coordinators_assigned.map((c) => c.id),
        })
        setSelectedFiles([])
        setShowForm(true)
    }, [])

    const openNotification = useCallback((type, title, message) => {
        const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
        toast.push(
            <Notification className={borderColor} title={title} type={type} duration={5000} closable>
                {message}
            </Notification>,
            { placement: 'top-start' }
        )
    }, [])

    const handleFileSelect = useCallback((e) => {
        const files = Array.from(e.target.files || [])
        setSelectedFiles((prev) => [...prev, ...files])
        e.target.value = ''
    }, [])

    const removeSelectedFile = useCallback((index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const handleDeleteExistingFile = useCallback(async (fileId) => {
        setDeletingFileId(fileId)
        try {
            await apiDeleteFile(fileId)
            setTasks((prev) =>
                prev.map((t) => ({
                    ...t,
                    files: t.files.filter((f) => f.id !== fileId),
                    hasFiles: t.files.filter((f) => f.id !== fileId).length > 0,
                }))
            )
            openNotification('success', 'Éxito', 'Archivo eliminado correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el archivo.')
        } finally {
            setDeletingFileId(null)
        }
    }, [openNotification])

    const handleSave = async (values, { setSubmitting, setErrors }) => {
        const payload = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            status_id: values.status_id || undefined,
            dt_delivery_limit: values.dt_delivery_limit
                ? dayjs(values.dt_delivery_limit).format('YYYY-MM-DD')
                : null,
        }

        payload.coordinators_ids = values.coordinators_ids

        setSubmitting(true)
        try {
            let taskId = editing
            if (editing) {
                const resp = await apiUpdateTask(editing, payload)
                const updated = resp?.data?.data
                if (updated) {
                    setTasks((prev) =>
                        prev.map((t) => {
                            if (t.id !== editing) return t
                            const normalized = normalizeTask(updated)
                            return {
                                ...normalized,
                                files: normalized.files.length > 0 ? normalized.files : t.files,
                                hasFiles: normalized.files.length > 0 || t.files.length > 0,
                            }
                        })
                    )
                }
                openNotification('success', 'Éxito', 'Tarea actualizada correctamente')
            } else {
                const resp = await apiCreateTask(payload)
                const created = resp?.data?.data
                if (created) {
                    setTasks((prev) => [normalizeTask(created), ...prev])
                    taskId = created.id
                }
                openNotification('success', 'Éxito', 'Tarea creada correctamente')
            }

            if (taskId && selectedFiles.length > 0) {
                const results = await Promise.allSettled(
                    selectedFiles.map((file) => {
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('task_id', taskId)
                        return apiUploadFile(formData)
                    })
                )

                const newFiles = results
                    .filter((r) => r.status === 'fulfilled' && r.value?.data?.data)
                    .map((r) => {
                        const f = r.value.data.data
                        return {
                            id: f.id,
                            name: f.file_name,
                            path: f.path || f.url,
                            type: f.type,
                            uploaded_by: f.uploaded_by || null,
                            created_at: f.created_at,
                        }
                    })

                const failed = results.filter((r) => r.status === 'rejected' || !r.value?.data?.data)
                if (failed.length > 0) {
                    const errMsg = failed[0].status === 'rejected'
                        ? failed[0].reason?.response?.data?.message || failed[0].reason?.message || 'Error desconocido'
                        : 'La respuesta del servidor no contiene datos'
                    openNotification('danger', 'Error al subir archivos', `${failed.length} archivo(s) no se pudieron subir: ${errMsg}`)
                }

                if (newFiles.length > 0) {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.id === taskId
                                ? { ...t, files: [...(t.files || []), ...newFiles], hasFiles: true }
                                : t
                        )
                    )
                }
            }

            setEditing(null)
            setFormValues({ title: '', description: '', status_id: null, dt_delivery_limit: null, coordinators_ids: [] })
            setSelectedFiles([])
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

            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar la tarea.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiDeleteTask(id)
            setTasks((prev) => prev.filter((t) => t.id !== id))
            openNotification('success', 'Éxito', 'Tarea eliminada correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar la tarea.')
        } finally {
            setConfirmDelete({ open: false, id: null })
        }
    }

    const handleRequestReview = useCallback(async (taskId) => {
        try {
            const resp = await apiRequestReview(taskId)
            const updated = resp?.data?.data
            if (updated) {
                setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? normalizeTask(updated) : t))
                )
            }
            openNotification('success', 'Éxito', 'Solicitud de revisión enviada')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo solicitar la revisión.')
        }
    }, [normalizeTask, openNotification])

    const handleReview = useCallback(async (taskId, action, observation) => {
        try {
            const resp = await apiApproveReview(taskId, action, observation)
            const updated = resp?.data?.data
            if (updated) {
                setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? normalizeTask(updated) : t))
                )
            }
            const msg = action === 'approved' ? 'Revisión aprobada' : 'Revisión rechazada'
            openNotification('success', 'Éxito', msg)
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo completar la revisión.')
        }
    }, [normalizeTask, openNotification])

    const formatDate = useCallback((value) => {
        if (!value) return '-'
        const parsed = dayjs(value)
        return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Título',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <div>
                        <span className="font-medium">{row.original.title}</span>
                        {row.original.created_by && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                Creado por: {row.original.created_by.name}
                            </p>
                        )}
                    </div>
                ),
            },
            {
                header: 'Estado',
                accessorKey: 'status_name',
                cell: ({ row }) => {
                    const color = statusColorMap[row.original.status_id] || '#64748B'
                    return (
                        <Tag
                            prefix={
                                <span
                                    className="tag-affix tag-prefix"
                                    style={{ backgroundColor: color }}
                                />
                            }
                        >
                            {row.original.status_name || '-'}
                        </Tag>
                    )
                },
            },
            {
                header: 'Coordinadores',
                accessorKey: 'coordinators_assigned',
                cell: ({ row }) => {
                    const list = row.original.coordinators_assigned
                    if (!list || list.length === 0) return <span className="text-slate-400">-</span>
                    return (
                        <div className="flex flex-wrap gap-1">
                            {list.map((c) => (
                                <Tag key={c.id} className="border-0 bg-slate-100 text-slate-600 text-xs">
                                    {c.name}
                                </Tag>
                            ))}
                        </div>
                    )
                },
            },
            {
                header: 'Creación',
                accessorKey: 'created_at',
                cell: ({ row }) => formatDate(row.original.created_at),
            },
            {
                header: 'Vencimiento',
                accessorKey: 'dt_delivery_limit',
                cell: ({ row }) => {
                    const value = row.original.dt_delivery_limit
                    const statusId = row.original.status_id
                    if (!value) return <span className="text-slate-400">-</span>
                    const due = dayjs(value)
                    if (!due.isValid()) return <span className="text-slate-400">{value}</span>
                    const excluded = statusId === 4 || statusId === 6 || statusId === 7
                    const now = dayjs()
                    const overdue = due.isBefore(now, 'day') && !excluded
                    const dueToday = due.isSame(now, 'day') && !excluded
                    const dueSoon = !overdue && !dueToday && due.diff(now, 'day') <= 7 && !excluded
                    const cls = overdue
                        ? 'text-red-500 font-semibold'
                        : dueToday
                          ? 'text-amber-500 font-semibold'
                          : dueSoon
                            ? 'text-orange-500'
                            : 'text-slate-400'
                    return <span className={cls}>{formatDate(value)}</span>
                },
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => {
                    const t = row.original
                    const isInReview = t.status_id === 5
                    const isCompleted = t.status_id === 4
                    const isOverdue = t.dt_delivery_limit && dayjs(t.dt_delivery_limit).isBefore(dayjs(), 'day') && !isAdmin

                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => navigate(`/tasks/${t.id}`)}
                            >
                                Detalle
                            </Button>
                            {isAdmin && !isOverdue && (
                                <>
                                    <Button size="sm" variant="solid" onClick={() => openEdit(t)} icon={<HiPencil />} />
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="danger"
                                        onClick={() => setConfirmDelete({ open: true, id: t.id })}
                                        icon={<HiTrash />}
                                    />
                                </>
                            )}
                            {!isOverdue && isCompleted && (
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="amber"
                                    onClick={() => handleRequestReview(t.id)}
                                >
                                    Revisión
                                </Button>
                            )}
                            {!isOverdue && isInReview && isAdmin && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="emerald"
                                        onClick={() => setConfirmReviewAction({ open: true, id: t.id, action: 'approved', observation: '' })}
                                        icon={<HiCheck />}
                                    >
                                        Aprobar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="red"
                                        onClick={() => setConfirmReviewAction({ open: true, id: t.id, action: 'rejected', observation: '' })}
                                        icon={<HiX />}
                                    >
                                        Rechazar
                                    </Button>
                                </>
                            )}
                        </div>
                    )
                },
            },
        ],
        [navigate, openEdit, handleRequestReview, setConfirmReviewAction, isAdmin, statusColorMap, formatDate]
    )

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tareas</h3>
            </div>

            {error && <div className="text-center text-red-600">{error}</div>}
            {!error && (
                <DataTable
                    columns={columns}
                    data={tasks}
                    loading={isLoading}
                    RightContent={
                        isAdmin ? (
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={openNew}
                                icon={<HiPlusCircle className="text-2xl" />}
                            >
                                Nueva tarea
                            </Button>
                        ) : null
                    }
                />
            )}

            <TaskFormDrawer
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                editing={editing}
                formValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSave}
                statusOptions={statusOptions}
                coordinatorOptions={coordinatorOptions}
                tasks={tasks}
                handleDeleteExistingFile={handleDeleteExistingFile}
                deletingFileId={deletingFileId}
                handleFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                removeSelectedFile={removeSelectedFile}
            />

            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Eliminar tarea"
                type="danger"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
            >
                Esta acción no se puede deshacer. Si la tarea tiene subtareas no se podrá eliminar.
            </ConfirmDialog>

            <ReviewConfirmDialog
                isOpen={confirmReviewAction.open}
                action={confirmReviewAction.action}
                observation={confirmReviewAction.observation}
                onObservationChange={(value) =>
                    setConfirmReviewAction((prev) => ({ ...prev, observation: value }))
                }
                onCancel={() => setConfirmReviewAction({ open: false, id: null, action: null, observation: '' })}
                onConfirm={() => {
                    const { id, action, observation } = confirmReviewAction
                    setConfirmReviewAction({ open: false, id: null, action: null, observation: '' })
                    handleReview(id, action, observation)
                }}
            />
        </div>
    )
}

export default Tasks
