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
import {
    Drawer, Input, Select, DatePicker, FormItem, FormContainer,
    Notification, toast,
} from 'components/ui'
import Tag from 'components/ui/Tag'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import DataTable from 'components/custom/DataTable'
import { HiPlusCircle, HiPencil, HiTrash, HiCheck, HiX, HiPaperClip, HiDownload } from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
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
                header: 'Vencimiento',
                accessorKey: 'dt_delivery_limit',
                cell: ({ row }) => formatDate(row.original.dt_delivery_limit),
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => {
                    const t = row.original
                    const isInReview = t.status_id === 5
                    const isCompleted = t.status_id === 4

                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => navigate(`/tasks/${t.id}`)}
                            >
                                Detalle
                            </Button>
                            {isAdmin && (
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
                            {isCompleted && (
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="amber"
                                    onClick={() => handleRequestReview(t.id)}
                                >
                                    Revisión
                                </Button>
                            )}
                            {isInReview && isAdmin && (
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

            <Formik
                enableReinitialize
                initialValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSave}
            >
                {({ touched, errors, values, setFieldValue, setFieldTouched, isSubmitting, submitForm }) => (
                    <Drawer
                        isOpen={showForm}
                        onClose={() => setShowForm(false)}
                        placement="right"
                        closable
                        title={
                            <div>
                                <h4 className="mb-2">{editing ? 'Editar tarea' : 'Nueva tarea'}</h4>
                                <p>Completa los datos de la tarea</p>
                            </div>
                        }
                        footer={
                            <>
                                <Button size="sm" variant="solid" color="secondary" onClick={() => setShowForm(false)}>
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
                                <FormItem
                                    label="Título"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="title"
                                        placeholder="Título de la tarea"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Descripción"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                >
                                    <Field
                                        textArea
                                        rows={3}
                                        name="description"
                                        placeholder="Descripción"
                                        component={Input}
                                    />
                                </FormItem>
                                {editing && (
                                    <FormItem label="Estado">
                                        <Select
                                            placeholder="Selecciona el estado"
                                            value={statusOptions.find((o) => o.value === values.status_id)}
                                            options={statusOptions}
                                            onChange={(option) => setFieldValue('status_id', option ? option.value : null)}
                                            onBlur={() => setFieldTouched('status_id', true)}
                                        />
                                    </FormItem>
                                )}
                                <FormItem label="Vencimiento">
                                    <DatePicker
                                        value={values.dt_delivery_limit}
                                        onChange={(date) => setFieldValue('dt_delivery_limit', date)}
                                        inputFormat="YYYY-MM-DD"
                                        placeholder="Selecciona la fecha"
                                        size="md"
                                    />
                                </FormItem>
                                <FormItem label="Coordinadores asignados">
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        placeholder="Selecciona coordinadores"
                                        value={coordinatorOptions.filter((o) => values.coordinators_ids.includes(o.value))}
                                        options={coordinatorOptions}
                                        onChange={(options) =>
                                            setFieldValue(
                                                'coordinators_ids',
                                                options ? options.map((o) => o.value) : []
                                            )
                                        }
                                        onBlur={() => setFieldTouched('coordinators_ids', true)}
                                    />
                                </FormItem>

                                <FormItem label="Archivos">
                                    {editing && (() => {
                                        const taskFiles = tasks.find((t) => t.id === editing)?.files || []
                                        if (taskFiles.length === 0) return null
                                        return (
                                            <div className="mb-3 space-y-2">
                                                {taskFiles.map((file) => (
                                                    <div
                                                        key={file.id}
                                                        className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <HiPaperClip className="text-slate-400" />
                                                            <span>{file.name}</span>
                                                            <span className="text-xs uppercase text-slate-400">.{file.type}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteExistingFile(file.id)}
                                                            disabled={deletingFileId === file.id}
                                                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                        >
                                                            <HiTrash />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })()}

                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        accept=".pdf,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-slate-700 dark:file:text-slate-200"
                                    />

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {selectedFiles.map((file, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between rounded px-2 py-1 text-sm text-slate-600 dark:text-slate-300"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <HiPaperClip className="text-slate-400" />
                                                        <span>{file.name}</span>
                                                        <span className="text-xs text-slate-400">
                                                            ({(file.size / 1024).toFixed(1)} KB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSelectedFile(i)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <HiTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FormItem>
                            </FormContainer>
                        </Form>
                    </Drawer>
                )}
            </Formik>

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

            <ConfirmDialog
                isOpen={confirmReviewAction.open}
                title={confirmReviewAction.action === 'approved' ? 'Aprobar revisión' : 'Rechazar revisión'}
                type={confirmReviewAction.action === 'approved' ? 'success' : 'danger'}
                cancelText="Cancelar"
                confirmText={confirmReviewAction.action === 'approved' ? 'Aprobar' : 'Rechazar'}
                confirmButtonColor={confirmReviewAction.action === 'approved' ? 'emerald' : 'red'}
                onCancel={() => setConfirmReviewAction({ open: false, id: null, action: null, observation: '' })}
                onConfirm={() => {
                    const { id, action, observation } = confirmReviewAction
                    setConfirmReviewAction({ open: false, id: null, action: null, observation: '' })
                    handleReview(id, action, observation)
                }}
            >
                <p className="mb-3">
                    {confirmReviewAction.action === 'approved'
                        ? '¿Estás seguro de aprobar esta tarea?'
                        : '¿Estás seguro de rechazar esta tarea?'}
                </p>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Observación
                    </label>
                    <textarea
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        rows={3}
                        placeholder="Escribe una observación..."
                        value={confirmReviewAction.observation}
                        onChange={(e) =>
                            setConfirmReviewAction((prev) => ({ ...prev, observation: e.target.value }))
                        }
                    />
                </div>
            </ConfirmDialog>
        </div>
    )
}

export default Tasks
