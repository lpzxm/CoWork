import React, { useEffect, useCallback, useMemo, useState, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
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

import {
    HiArrowLeft, HiPaperClip, HiTrash, HiPlusCircle, HiPencil,
    HiCheck, HiX, HiUpload, HiDownload, HiClock, HiEye,
} from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
    apiGetTask,
    apiGetSubTasks,
    apiCreateSubTask,
    apiUpdateSubTask,
    apiDeleteSubTask,
    apiRequestReview,
    apiApproveReview,
} from 'services/TodoService'
import { apiGetStatuses } from 'services/StatusService'
import { apiUploadFile, apiDeleteFile, apiDownloadFile } from 'services/FileService'

const subtaskValidationSchema = Yup.object().shape({
    title: Yup.string().trim().required('El título es obligatorio.'),
    description: Yup.string().nullable(),
    status_id: Yup.number().nullable(),
    dt_delivery_limit: Yup.date().nullable(),
})

const normalizeSubtask = (st) => ({
    id: st.id,
    task_id: st.task_id?.id ?? null,
    title: st.title,
    description: st.description || '',
    status_id: st.status?.id ?? null,
    status_name: st.status?.name || '',
    dt_delivery_limit: st.dt_delivery_limit || '',
    files: st.files || [],
    created_by: st.created_by || null,
})

const SubtaskCard = memo(({ st, statusColorMap, openEditSubtask, onDelete, onDownloadFile, onPreviewFile, onDeleteFile, formatDate, canEdit = true }) => {
    const overdue = st.dt_delivery_limit && dayjs(st.dt_delivery_limit).isBefore(dayjs(), 'day') && st.status_id !== 4 && st.status_id !== 6 && st.status_id !== 7
    const dueToday = st.dt_delivery_limit && dayjs(st.dt_delivery_limit).isSame(dayjs(), 'day') && st.status_id !== 4 && st.status_id !== 6 && st.status_id !== 7
    const color = statusColorMap[st.status_id] || '#64748B'
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <h5 className="font-medium text-slate-800 dark:text-slate-100 truncate">{st.title}</h5>
                    </div>
                    {st.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{st.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {canEdit && (
                        <Button size="xs" variant="solid" onClick={() => openEditSubtask(st)} icon={<HiPencil />} />
                    )}
                    <Button size="xs" variant="solid" color="danger" onClick={() => onDelete(st.id)} icon={<HiTrash />} />
                </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <Tag prefix={<span className="tag-affix tag-prefix" style={{ backgroundColor: color }} />} className="!text-xs">
                    {st.status_name || '-'}
                </Tag>
                {st.dt_delivery_limit && (
                    <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-semibold' : dueToday ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                        <HiClock className="text-xs" />
                        {formatDate(st.dt_delivery_limit)}
                        {overdue && ' (Vencida)'}
                        {dueToday && ' (Hoy)'}
                    </span>
                )}
            </div>
            {(st.files || []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {(st.files || []).map((f) => (
                        <div key={f.id} className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-1">
                            <HiPaperClip className="text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            <div className="flex items-center gap-0.5 ml-1">
                                <button type="button" onClick={() => onPreviewFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700 p-0.5" title="Vista previa"><HiEye className="text-xs" /></button>
                                <button type="button" onClick={() => onDownloadFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700 p-0.5" title="Descargar"><HiDownload className="text-xs" /></button>
                                <button type="button" onClick={() => onDeleteFile(st.id, f.id)} className="text-red-400 hover:text-red-600 p-0.5" title="Eliminar"><HiTrash className="text-xs" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
})

const TaskDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentAuthority = useSelector((state) => state.auth.user.authority)
    const isAdmin = currentAuthority.some((r) => ['super-admin', 'admin'].includes(r))
    const isSuperAdmin = currentAuthority.includes('super-admin')

    const [task, setTask] = useState(null)
    const [subtasks, setSubtasks] = useState([])
    const [statuses, setStatuses] = useState([])
    const [taskLoading, setTaskLoading] = useState(true)
    const [subtasksLoading, setSubtasksLoading] = useState(true)
    const [error, setError] = useState('')

    const [showSubtaskForm, setShowSubtaskForm] = useState(false)
    const [editingSubtask, setEditingSubtask] = useState(null)
    const [subtaskFormValues, setSubtaskFormValues] = useState({
        title: '',
        description: '',
        status_id: null,
        dt_delivery_limit: null,
    })
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, type: null })
    const [confirmReview, setConfirmReview] = useState({ open: false })
    const [confirmReviewAction, setConfirmReviewAction] = useState({ open: false, action: null, observation: '' })

    const [taskNewFiles, setTaskNewFiles] = useState([])
    const [subtaskNewFiles, setSubtaskNewFiles] = useState([])

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

    const openNotification = useCallback((type, title, message) => {
        const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
        toast.push(
            <Notification className={borderColor} title={title} type={type} duration={5000} closable>
                {message}
            </Notification>,
            { placement: 'top-start' }
        )
    }, [])

    const loadTask = useCallback(async () => {
        setTaskLoading(true)
        setError('')
        try {
            const [taskResp, statusResp] = await Promise.all([
                apiGetTask(id),
                apiGetStatuses(),
            ])
            setTask(taskResp?.data?.data ?? null)
            setStatuses(statusResp?.data?.data ?? [])
        } catch (err) {
            console.log(err)
            setError('No se pudo cargar la tarea.')
        } finally {
            setTaskLoading(false)
        }
    }, [id])

    const loadSubtasks = useCallback(async () => {
        setSubtasksLoading(true)
        try {
            const resp = await apiGetSubTasks(id)
            setSubtasks((resp?.data?.data ?? []).map(normalizeSubtask))
        } catch (err) {
            console.log(err)
        } finally {
            setSubtasksLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadTask()
        loadSubtasks()
    }, [loadTask, loadSubtasks])

    const statusOptions = useMemo(() => {
        return statuses.map((s) => ({ value: s.id, label: s.name }))
    }, [statuses])

    const handleRequestReview = useCallback(async () => {
        if (!task?.id) return
        try {
            const resp = await apiRequestReview(task.id)
            const updated = resp?.data?.data
            if (updated) setTask(updated)
            openNotification('success', 'Éxito', 'Solicitud de revisión enviada')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo solicitar la revisión.')
        }
    }, [task?.id, openNotification])

    const handleReview = useCallback(async (action, observation) => {
        if (!task?.id) return
        try {
            const resp = await apiApproveReview(task.id, action, observation || undefined)
            const updated = resp?.data?.data
            if (updated) setTask(updated)
            const msg = action === 'approved' ? 'Revisión aprobada' : 'Revisión rechazada'
            openNotification('success', 'Éxito', msg)
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo completar la revisión.')
        }
    }, [task?.id, openNotification])

    const handleTaskFileSelect = useCallback((e) => {
        const files = Array.from(e.target.files || [])
        setTaskNewFiles((prev) => [...prev, ...files])
        e.target.value = ''
    }, [])

    const removeTaskNewFile = useCallback((index) => {
        setTaskNewFiles((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const uploadTaskFiles = useCallback(async (files, taskId) => {
        if (!files.length || !taskId) return
        const results = await Promise.allSettled(
            files.map((file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('task_id', taskId)
                return apiUploadFile(formData)
            })
        )
        const uploaded = results
            .filter((r) => r.status === 'fulfilled' && r.value?.data?.data)
            .map((r) => r.value.data.data)
        if (!uploaded.length) return
        const newEntries = uploaded.map((f) => ({
            id: f.id,
            name: f.file_name,
            path: f.path || f.url,
            type: f.type,
            uploaded_by: f.uploaded_by || null,
            created_at: f.created_at,
        }))
        setTask((prev) => prev ? {
            ...prev,
            files: [...(prev.files || []), ...newEntries],
        } : prev)
    }, [])

    const handleUploadTaskFiles = useCallback(async () => {
        if (!taskNewFiles.length || !task?.id) return
        await uploadTaskFiles(taskNewFiles, task.id)
        setTaskNewFiles([])
        openNotification('success', 'Éxito', 'Archivos subidos correctamente')
    }, [taskNewFiles, task?.id, uploadTaskFiles, openNotification])

    const handleDownloadFile = useCallback(async (fileId, fileName) => {
        try {
            const resp = await apiDownloadFile(fileId)
            const blob = resp.data
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo descargar el archivo.')
        }
    }, [openNotification])

    const handlePreviewFile = useCallback(async (fileId, fileName) => {
        try {
            const resp = await apiDownloadFile(fileId)
            const blob = resp.data
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo abrir el archivo.')
        }
    }, [openNotification])

    const handleDeleteTaskFile = useCallback(async (fileId) => {
        try {
            await apiDeleteFile(fileId)
            setTask((prev) => prev ? {
                ...prev,
                files: (prev.files || []).filter((f) => f.id !== fileId),
            } : prev)
            openNotification('success', 'Éxito', 'Archivo eliminado correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el archivo.')
        }
    }, [openNotification])

    const openNewSubtask = useCallback(() => {
        setEditingSubtask(null)
        setSubtaskFormValues({ title: '', description: '', status_id: null, dt_delivery_limit: null })
        setSubtaskNewFiles([])
        setShowSubtaskForm(true)
    }, [])

    const openEditSubtask = useCallback((st) => {
        setEditingSubtask(st.id)
        setSubtaskFormValues({
            title: st.title,
            description: st.description || '',
            status_id: st.status_id,
            dt_delivery_limit: st.dt_delivery_limit ? dayjs(st.dt_delivery_limit).toDate() : null,
        })
        setSubtaskNewFiles([])
        setShowSubtaskForm(true)
    }, [])

    const uploadSubtasksFiles = useCallback(async (files, subtaskId) => {
        if (!files.length || !subtaskId) return
        const results = await Promise.allSettled(
            files.map((file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('sub_task_id', subtaskId)
                return apiUploadFile(formData)
            })
        )
        const uploaded = results
            .filter((r) => r.status === 'fulfilled' && r.value?.data?.data)
            .map((r) => r.value.data.data)
        const failed = results.filter((r) => r.status === 'rejected' || !r.value?.data?.data)
        if (failed.length > 0) {
            const errMsg = failed[0].status === 'rejected'
                ? failed[0].reason?.response?.data?.message || failed[0].reason?.message || 'Error desconocido'
                : 'La respuesta del servidor no contiene datos'
            openNotification('danger', 'Error al subir archivos', `${failed.length} archivo(s) no se pudieron subir: ${errMsg}`)
        }
        if (!uploaded.length) return
        const newEntries = uploaded.map((f) => ({
            id: f.id,
            name: f.file_name,
            path: f.path || f.url,
            type: f.type,
            uploaded_by: f.uploaded_by || null,
            created_at: f.created_at,
        }))
        setSubtasks((prev) =>
            prev.map((s) =>
                s.id === subtaskId ? { ...s, files: [...(s.files || []), ...newEntries] } : s
            )
        )
        if (uploaded.length > 0) {
            openNotification('success', 'Archivos subidos', `${uploaded.length} archivo(s) subido(s) correctamente.`)
        }
    }, [openNotification, setSubtasks])

    const handleSubtaskSave = useCallback(async (values, { setSubmitting, setErrors }) => {
        const payload = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            status_id: values.status_id || undefined,
            dt_delivery_limit: values.dt_delivery_limit
                ? dayjs(values.dt_delivery_limit).format('YYYY-MM-DD')
                : null,
        }

        setSubmitting(true)
        try {
            let targetSubtaskId = editingSubtask
            if (editingSubtask) {
                const resp = await apiUpdateSubTask(editingSubtask, payload)
                const updated = resp?.data?.data
                if (updated) {
                    setSubtasks((prev) =>
                        prev.map((s) => s.id === editingSubtask ? normalizeSubtask(updated) : s)
                    )
                }
                openNotification('success', 'Éxito', 'Subtarea actualizada correctamente')
            } else {
                const resp = await apiCreateSubTask(id, payload)
                const created = resp?.data?.data
                if (created) {
                    targetSubtaskId = created.id
                    setSubtasks((prev) => [normalizeSubtask(created), ...prev])
                }
                openNotification('success', 'Éxito', 'Subtarea creada correctamente')
            }

            if (subtaskNewFiles.length > 0 && targetSubtaskId) {
                await uploadSubtasksFiles(subtaskNewFiles, targetSubtaskId)
            }

            setEditingSubtask(null)
            setSubtaskFormValues({ title: '', description: '', status_id: null, dt_delivery_limit: null })
            setSubtaskNewFiles([])
            setShowSubtaskForm(false)
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
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar la subtarea.')
        } finally {
            setSubmitting(false)
        }
    }, [editingSubtask, id, subtaskNewFiles, uploadSubtasksFiles, openNotification])

    const handleDeleteSubtask = useCallback(async (subtaskId) => {
        try {
            await apiDeleteSubTask(subtaskId)
            setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId))
            openNotification('success', 'Éxito', 'Subtarea eliminada correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar la subtarea.')
        } finally {
            setConfirmDelete({ open: false, id: null, type: null })
        }
    }, [openNotification])

    const handleDeleteSubtaskFile = useCallback(async (subtaskId, fileId) => {
        try {
            await apiDeleteFile(fileId)
            setSubtasks((prev) =>
                prev.map((s) =>
                    s.id === subtaskId
                        ? { ...s, files: s.files.filter((f) => f.id !== fileId) }
                        : s
                )
            )
            openNotification('success', 'Éxito', 'Archivo eliminado correctamente')
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar el archivo.')
        }
    }, [openNotification])

    const formatDate = useCallback((value) => {
        if (!value) return '-'
        const parsed = dayjs(value)
        return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value
    }, [])

    const canEditSubtasks = task?.status?.id !== 6 || isSuperAdmin

    const subtasksContent = useMemo(() => {
        return subtasks.map((st) => (
            <SubtaskCard
                key={st.id}
                st={st}
                statusColorMap={statusColorMap}
                openEditSubtask={openEditSubtask}
                onDelete={(id) => setConfirmDelete({ open: true, id, type: 'subtask' })}
                onDownloadFile={handleDownloadFile}
                onPreviewFile={handlePreviewFile}
                onDeleteFile={handleDeleteSubtaskFile}
                formatDate={formatDate}
                canEdit={canEditSubtasks}
            />
        ))
    }, [subtasks, statusColorMap, openEditSubtask, handleDownloadFile, handlePreviewFile, handleDeleteSubtaskFile, formatDate, canEditSubtasks])

    if (taskLoading) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-center h-40 text-slate-400">
                    Cargando...
                </div>
            </div>
        )
    }

    if (error || !task) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-center h-40 text-red-600">
                    {error || 'Tarea no encontrada'}
                </div>
                <div className="flex justify-center mt-4">
                    <Button onClick={() => navigate('/tasks')}>
                        ← Volver a tareas
                    </Button>
                </div>
            </div>
        )
    }

    const allSubtasksCompleted = subtasks.length > 0 && subtasks.every((s) => s.status_id === 4)
    const isInReview = task.status?.id === 5
    const isApproved = task.status?.id === 6
    const isRejected = task.status?.id === 7
    const canRequestReview = subtasks.length > 0 && allSubtasksCompleted && !isInReview && !isApproved && !isRejected

    return (
        <div className="p-4 space-y-8">
            <div className="flex items-center justify-between">
                <Button
                    variant="solid"
                    onClick={() => navigate('/tasks')}
                    icon={<HiArrowLeft className="text-lg" />}
                >
                    Volver
                </Button>
                <div className="flex items-center gap-2">
                    {canRequestReview && (
                        <Button
                            variant="solid"
                            color="amber"
                            onClick={() => setConfirmReview({ open: true })}
                        >
                            Solicitar revisión
                        </Button>
                    )}
                    {isInReview && isAdmin && (
                        <>
                            <Button
                                variant="solid"
                                color="emerald"
                                onClick={() => setConfirmReviewAction({ open: true, action: 'approved', observation: '' })}
                                icon={<HiCheck />}
                            >
                                Aprobar
                            </Button>
                            <Button
                                variant="solid"
                                color="red"
                                onClick={() => setConfirmReviewAction({ open: true, action: 'rejected', observation: '' })}
                                icon={<HiX />}
                            >
                                Rechazar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                        <h4 className="text-xl font-semibold mb-1">{task.title}</h4>
                        {task.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                        )}
                    </div>
                    <Tag
                        prefix={
                            <span
                                className="tag-affix tag-prefix"
                                style={{ backgroundColor: statusColorMap[task.status?.id] || '#64748B' }}
                            />
                        }
                    >
                        {task.status?.name || '-'}
                    </Tag>
                </div>

                <div className="grid grid-cols-3 gap-5 text-sm border-t border-slate-100 dark:border-slate-700 pt-5">
                    <div>
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Creada por</span>
                        <span className="text-slate-700 dark:text-slate-200">{task.created_by?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Vencimiento</span>
                        <span className="text-slate-700 dark:text-slate-200">{formatDate(task.dt_delivery_limit)}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Coordinadores</span>
                        {task.coordinators_assigned?.length > 0 ? (
                            <span className="text-slate-700 dark:text-slate-200">
                                {task.coordinators_assigned.map((c) => c.name).join(', ')}
                            </span>
                        ) : (
                            <span className="text-slate-400">-</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h5 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                    <HiPaperClip className="text-base" />
                    Archivos de la tarea
                </h5>
                {(task.files || []).length > 0 && (
                    <div className="mb-3 space-y-2">
                        {(task.files || []).map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="flex items-center gap-2.5 text-sm min-w-0">
                                    <HiPaperClip className="text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-xs uppercase text-slate-400 flex-shrink-0">.{file.type}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                                    <button
                                        type="button"
                                        onClick={() => handlePreviewFile(file.id, file.name)}
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="Vista previa"
                                    >
                                        <HiEye />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadFile(file.id, file.name)}
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="Descargar"
                                    >
                                        <HiDownload />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTaskFile(file.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <HiTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isAdmin ? (
                    <>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                multiple
                                onChange={handleTaskFileSelect}
                                accept=".pdf,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                                className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-slate-700 dark:file:text-slate-200"
                            />
                            {taskNewFiles.length > 0 && (
                                <Button size="sm" variant="solid" onClick={handleUploadTaskFiles} icon={<HiUpload />}>
                                    Subir ({taskNewFiles.length})
                                </Button>
                            )}
                        </div>
                        {taskNewFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {taskNewFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <HiPaperClip className="text-slate-400" />
                                            <span>{file.name}</span>
                                            <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button type="button" onClick={() => removeTaskNewFile(i)} className="text-red-500 hover:text-red-700">
                                            <HiTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    ""
                )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold">Subtareas</h4>
                            {subtasks.length > 0 && (
                                <Tag className="!text-xs">{subtasks.filter((s) => s.status_id === 4).length}/{subtasks.length} completadas</Tag>
                            )}
                        </div>
                        {subtasks.length > 0 && (
                            <div className="mt-3 w-48 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(subtasks.filter((s) => s.status_id === 4).length / subtasks.length) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                    {canEditSubtasks && (
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={openNewSubtask}
                            icon={<HiPlusCircle className="text-2xl" />}
                        >
                            Nueva subtarea
                        </Button>
                    )}
                </div>

                {subtasksLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse dark:border-slate-700 dark:bg-slate-800">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2 mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-16" />
                                    <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : subtasks.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <HiPaperClip className="mx-auto text-3xl mb-3 opacity-40" />
                        <p>No hay subtareas. Crea una para empezar.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {subtasksContent}
                    </div>
                )}
            </div>

            <Formik
                enableReinitialize
                initialValues={subtaskFormValues}
                validationSchema={subtaskValidationSchema}
                onSubmit={handleSubtaskSave}
            >
                {({ touched, errors, values, setFieldValue, setFieldTouched, isSubmitting, submitForm }) => (
                    <Drawer
                        isOpen={showSubtaskForm}
                        onClose={() => setShowSubtaskForm(false)}
                        placement="right"
                        closable
                        title={
                            <div>
                                <h4 className="mb-2">{editingSubtask ? 'Editar subtarea' : 'Nueva subtarea'}</h4>
                                <p>Completa los datos de la subtarea</p>
                            </div>
                        }
                        footer={
                            <>
                                <Button size="sm" variant="solid" color="secondary" onClick={() => setShowSubtaskForm(false)}>
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
                                        placeholder="Título de la subtarea"
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
                                {editingSubtask && (
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

                                {editingSubtask && (() => {
                                    const current = subtasks.find((s) => s.id === editingSubtask)
                                    if (!current || !current.files?.length) return null
                                    return (
                                        <FormItem label="Archivos actuales">
                                            <div className="space-y-2">
                                                {current.files.map((f) => (
                                                    <div key={f.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                                                        <div className="flex items-center gap-2">
                                                            <HiPaperClip className="text-slate-400" />
                                                            <span>{f.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button type="button" onClick={() => handlePreviewFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700" title="Vista previa">
                                                                <HiEye />
                                                            </button>
                                                            <button type="button" onClick={() => handleDownloadFile(f.id, f.name)} className="text-blue-500 hover:text-blue-700" title="Descargar">
                                                                <HiDownload />
                                                            </button>
                                                            <button type="button" onClick={() => handleDeleteSubtaskFile(editingSubtask, f.id)} className="text-red-500 hover:text-red-700">
                                                                <HiTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormItem>
                                    )
                                })()}

                                <FormItem label="Subir archivos">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || [])
                                            setSubtaskNewFiles((prev) => [...prev, ...files])
                                            e.target.value = ''
                                        }}
                                        accept=".pdf,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-slate-700 dark:file:text-slate-200"
                                    />
                                    {subtaskNewFiles.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {subtaskNewFiles.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <HiPaperClip className="text-slate-400" />
                                                        <span>{file.name}</span>
                                                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                                    </div>
                                                    <button type="button" onClick={() => setSubtaskNewFiles((prev) => prev.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700">
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
                title={confirmDelete.type === 'subtask' ? 'Eliminar subtarea' : 'Eliminar'}
                type="danger"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmDelete({ open: false, id: null, type: null })}
                onConfirm={() => {
                    if (confirmDelete.type === 'subtask') handleDeleteSubtask(confirmDelete.id)
                }}
            >
                {confirmDelete.type === 'subtask'
                    ? 'Esta acción no se puede deshacer. Si la subtarea tiene archivos asociados, no se podrá eliminar.'
                    : '¿Estás seguro de eliminar este elemento?'}
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={confirmReview.open}
                title="Solicitar revisión"
                type="info"
                cancelText="Cancelar"
                confirmText="Solicitar"
                confirmButtonColor="amber"
                onCancel={() => setConfirmReview({ open: false })}
                onConfirm={() => {
                    setConfirmReview({ open: false })
                    handleRequestReview()
                    navigate('/tasks')
                }}
            >
                ¿Estás seguro de solicitar la revisión de esta tarea? Una vez enviada, solo los administradores podrán aprobarla o rechazarla.
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={confirmReviewAction.open}
                title={confirmReviewAction.action === 'approved' ? 'Aprobar revisión' : 'Rechazar revisión'}
                type={confirmReviewAction.action === 'approved' ? 'success' : 'danger'}
                cancelText="Cancelar"
                confirmText={confirmReviewAction.action === 'approved' ? 'Aprobar' : 'Rechazar'}
                confirmButtonColor={confirmReviewAction.action === 'approved' ? 'emerald' : 'red'}
                onCancel={() => setConfirmReviewAction({ open: false, action: null, observation: '' })}
                onConfirm={() => {
                    const { action, observation } = confirmReviewAction
                    setConfirmReviewAction({ open: false, action: null, observation: '' })
                    handleReview(action, observation)
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

export default TaskDetail
