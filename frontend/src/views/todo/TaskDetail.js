import React, { useEffect, useCallback, useMemo, useState } from 'react'
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
    Notification, toast,
} from 'components/ui'
import Tag from 'components/ui/Tag'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import Progress from 'components/ui/Progress'

import {
    HiArrowLeft, HiPaperClip, HiPlusCircle,
    HiCheck, HiX,
} from 'react-icons/hi'
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
import SubtaskCard from './components/SubtaskCard'
import SubtaskFormDrawer from './components/SubtaskFormDrawer'
import ReviewConfirmDialog from './components/ReviewConfirmDialog'
import TaskInfoCard from './components/TaskInfoCard'
import TaskFilesSection from './components/TaskFilesSection'

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

            <TaskInfoCard task={task} statusColorMap={statusColorMap} formatDate={formatDate} />

            <TaskFilesSection
                task={task}
                isAdmin={isAdmin}
                handlePreviewFile={handlePreviewFile}
                handleDownloadFile={handleDownloadFile}
                handleDeleteTaskFile={handleDeleteTaskFile}
                taskNewFiles={taskNewFiles}
                handleTaskFileSelect={handleTaskFileSelect}
                handleUploadTaskFiles={handleUploadTaskFiles}
                removeTaskNewFile={removeTaskNewFile}
            />

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
                            <div className="mt-3 w-48">
                                <Progress
                                    variant="line"
                                    percent={Math.round((subtasks.filter((s) => s.status_id === 4).length / subtasks.length) * 100)}
                                    showInfo={false}
                                    size="sm"
                                    color="emerald-500"
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

            <SubtaskFormDrawer
                isOpen={showSubtaskForm}
                onClose={() => setShowSubtaskForm(false)}
                editingSubtask={editingSubtask}
                subtaskFormValues={subtaskFormValues}
                validationSchema={subtaskValidationSchema}
                onSubmit={handleSubtaskSave}
                statusOptions={statusOptions}
                subtasks={subtasks}
                handlePreviewFile={handlePreviewFile}
                handleDownloadFile={handleDownloadFile}
                handleDeleteSubtaskFile={handleDeleteSubtaskFile}
                subtaskNewFiles={subtaskNewFiles}
                setSubtaskNewFiles={setSubtaskNewFiles}
            />

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

            <ReviewConfirmDialog
                isOpen={confirmReviewAction.open}
                action={confirmReviewAction.action}
                observation={confirmReviewAction.observation}
                onObservationChange={(value) =>
                    setConfirmReviewAction((prev) => ({ ...prev, observation: value }))
                }
                onCancel={() => setConfirmReviewAction({ open: false, action: null, observation: '' })}
                onConfirm={() => {
                    const { action, observation } = confirmReviewAction
                    setConfirmReviewAction({ open: false, action: null, observation: '' })
                    handleReview(action, observation)
                }}
            />
        </div>
    )
}

export default TaskDetail
