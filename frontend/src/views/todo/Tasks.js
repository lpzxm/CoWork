import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Button } from 'components/custom'
import { Drawer, Input, Select, DatePicker, FormItem, FormContainer, Notification, toast, Checkbox } from 'components/ui'
import Tag from 'components/ui/Tag'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import DataTable from 'components/custom/DataTable'
import { HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import useAuthority from 'utils/hooks/useAuthority'
import {
    apiGetTaskCategories,
    apiGetTasks,
    apiCreateTask,
    apiUpdateTask,
    apiUpdateTaskStatus,
    apiDeleteTask,
} from 'services/TodoService'

const Tasks = () => {
    const dispatch = useDispatch()

    const userPermissions = useSelector((state) => state.auth.user.permissions)
    const canViewCategories = useAuthority(userPermissions, ['todo.category.view'])
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [updatingIds, setUpdatingIds] = useState({})
    const [categoryFilter, setCategoryFilter] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        categoryId: '',
        dueDate: null,
        status: 'pending',
        priority: 'medium',
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

    const normalizeCategory = useCallback((category) => {
        return {
            id: category.id,
            name: category.name,
            color: category.color || '#CBD5E1',
        }
    }, [])

    const normalizeTask = useCallback((task) => {
        return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            categoryId: task.category_id ?? task.category?.id ?? null,
            dueDate: task.due_date ? dayjs(task.due_date).format('YYYY-MM-DD') : '',
            status: task.status,
            priority: task.priority,
            completed: task.status === 'completed',
        }
    }, [])

    const loadData = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            if (canViewCategories) {
                const [categoryResponse, taskResponse] = await Promise.all([
                    apiGetTaskCategories(),
                    apiGetTasks(),
                ])

                const categoryData = categoryResponse?.data?.data ?? []
                const taskData = taskResponse?.data?.data ?? []

                setCategories(categoryData.map(normalizeCategory))
                setTasks(taskData.map(normalizeTask))
            } else {
                const taskResponse = await apiGetTasks()
                const taskData = taskResponse?.data?.data ?? []

                setCategories([])
                setCategoryFilter('')
                setTasks(taskData.map(normalizeTask))
            }
        } catch (err) {
            console.log(err);
            setError('No se pudo cargar la informacion de tareas.')
            
        } finally {
            setIsLoading(false)
        }
    }, [canViewCategories, normalizeCategory, normalizeTask])

    useEffect(() => {
        loadData()
    }, [loadData])

    const openNew = () => {
        setEditing(null)
        setFormValues({
            title: '',
            description: '',
            categoryId: categories[0]?.id || '',
            dueDate: null,
            status: 'pending',
            priority: 'medium',
        })
        setShowForm(true)
    }

    const openEdit = useCallback((task) => {
        setEditing(task.id)
        setFormValues({
            title: task.title,
            description: task.description || '',
            categoryId: task.categoryId,
            dueDate: task.dueDate ? dayjs(task.dueDate, 'YYYY-MM-DD').toDate() : null,
            status: task.status || 'pending',
            priority: task.priority || 'medium',
        })
        setShowForm(true)
    }, [])

    const handleSave = async (values, { setSubmitting }) => {
        const payload = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            due_date: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD 00:00:00') : null,
            status: values.status || 'pending',
            priority: values.priority || 'medium',
        }

        if (canViewCategories) {
            payload.category_id = values.categoryId
        }

        try {
            if (editing) {
                const response = await apiUpdateTask(editing, payload)
                const updated = response?.data?.data ? normalizeTask(response.data.data) : null
                if (updated) {
                    setTasks((prev) => prev.map((item) => (item.id === editing ? { ...item, ...updated } : item)))
                } else {
                    const fallback = {
                        id: editing,
                        title: values.title.trim(),
                        description: values.description?.trim() || '',
                        categoryId: values.categoryId,
                        dueDate: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD') : '',
                        status: values.status || 'pending',
                        priority: values.priority || 'medium',
                        completed: (values.status || 'pending') === 'completed',
                    }
                    setTasks((prev) => prev.map((item) => (item.id === editing ? { ...item, ...fallback } : item)))
                }
                openNotification('success', 'Éxito', 'Tarea actualizada correctamente')
            } else {
                await apiCreateTask(payload)
                openNotification('success', 'Éxito', 'Tarea creada correctamente')
                await loadData()
            }

            setShowForm(false)
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar la tarea.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiDeleteTask(id)
            openNotification('success', 'Éxito', 'Tarea eliminada correctamente')
            await loadData()
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar la tarea.')
        } finally {
            setConfirmDelete({ open: false, id: null })
        }
    }

    const getCategory = useCallback((id) => categories.find((c) => c.id === id), [categories])


    const priorityLabel = useCallback((priority) => {
        const labels = {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta',
        }

        return labels[priority] || 'Media'
    }, [])

    const formatDueDate = useCallback((value) => {
        if (!value) {
            return '-'
        }

        const parsed = dayjs(value)
        return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value
    }, [])

    const categoryOptions = useMemo(
        () => [
            { value: '', label: 'Todas' },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
        ],
        [categories]
    )

    const filteredTasks = useMemo(() => {
        if (!categoryFilter) {
            return tasks
        }

        return tasks.filter((task) => String(task.categoryId) === String(categoryFilter))
    }, [categoryFilter, tasks])

    const openNotification = (type, title, message) => {
        const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
        toast.push(
            <Notification className={borderColor} title={title} type={type} duration={5000} closable>
                {message}
            </Notification>,
            { placement: 'top-start' }
        )
    }

    const handleToggleComplete = useCallback(async (task) => {
        if (updatingIds[task.id]) {
            return
        }
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        const previousStatus = task.status

        setUpdatingIds((prev) => ({ ...prev, [task.id]: true }))

        setTasks((prev) =>
            prev.map((item) =>
                item.id === task.id
                    ? {
                          ...item,
                          status: newStatus,
                          completed: newStatus === 'completed',
                      }
                    : item
            )
        )

        try {
            const response = await apiUpdateTaskStatus(task.id, { status: newStatus })
            const updated = response?.data?.data ? normalizeTask(response.data.data) : null
            if (updated) {
                setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, ...updated } : item)))
            }
        } catch (err) {
            setTasks((prev) =>
                prev.map((item) =>
                    item.id === task.id
                        ? {
                              ...item,
                              status: previousStatus,
                              completed: previousStatus === 'completed',
                          }
                        : item
                )
            )
        } finally {
            setUpdatingIds((prev) => {
                const next = { ...prev }
                delete next[task.id]
                return next
            })
        }
    }, [normalizeTask, updatingIds])

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            title: Yup.string().trim().required('El titulo es obligatorio.'),
            description: Yup.string().nullable(),
            categoryId: canViewCategories
                ? Yup.string().required('La categoria es obligatoria.')
                : Yup.string().nullable(),
            dueDate: Yup.date().nullable(),
        })
    }, [canViewCategories])

    const columns = useMemo(
        () => [
            {
                id: 'completed',
                header: '',
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.original.status === 'completed'}
                        onChange={() => handleToggleComplete(row.original)}
                        disabled={Boolean(updatingIds[row.original.id])}
                    />
                ),
            },
            {
                header: 'Título',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <span className={row.original.status === 'completed' ? 'line-through text-slate-400' : ''}>
                        {row.original.title}
                    </span>
                ),
            },
            {
                header: 'Categoría',
                accessorKey: 'categoryId',
                cell: ({ row }) => {
                    const category = getCategory(row.original.categoryId)
                    return category ? (
                        <Tag
                            prefix={
                                <span
                                    className="tag-affix tag-prefix"
                                    style={{ backgroundColor: category.color }}
                                />
                            }
                        >
                            {category.name}
                        </Tag>
                    ) : (
                        '-'
                    )
                },
            },
            {
                header: 'Vencimiento',
                accessorKey: 'dueDate',
                cell: ({ row }) => formatDueDate(row.original.dueDate),
            },
            {
                header: 'Prioridad',
                accessorKey: 'priority',
                cell: ({ row }) => priorityLabel(row.original.priority),
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
        [
            formatDueDate,
            getCategory,
            handleToggleComplete,
            openEdit,
            priorityLabel,
            updatingIds,
        ]
    )

    return (
        <div className="p-4">
            {isLoading && <div className="text-center">Cargando...</div>}
            {!isLoading && error && <div className="text-center text-red-600">{error}</div>}
            {!isLoading && !error && (
                <DataTable
                    columns={columns}
                    data={filteredTasks}
                    LeftContent={
                        canViewCategories ?? (
                            <div className="flex gap-4 w-full">
                                <Select
                                    className="w-1/2"
                                    isSearchable={false}
                                    value={categoryOptions.find((option) => String(option.value) === String(categoryFilter))}
                                    options={categoryOptions}
                                    placeholder="Filtrar por categoria"
                                    onChange={(option) => setCategoryFilter(option?.value ?? '')}
                                />
                            </div>
                        )
                    }
                    RightContent={
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={openNew}
                            icon={<HiPlusCircle className="text-2xl" />}
                        >
                            Nueva tarea
                        </Button>
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
                                <h4 className='mb-2'>{editing ? 'Editar tarea' : 'Nueva tarea'}</h4>
                                <p>Completa los datos para la tarea</p>
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
                                    label="Titulo"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="title"
                                        placeholder="Titulo"
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
                                {canViewCategories && (
                                    <FormItem
                                        label="Categoria"
                                        invalid={errors.categoryId && touched.categoryId}
                                        errorMessage={errors.categoryId}
                                    >
                                        <Select
                                            value={categories
                                                .map((c) => ({ value: c.id, label: c.name }))
                                                .find((option) => option.value === values.categoryId)}
                                            onChange={(option) => setFieldValue('categoryId', option?.value || '')}
                                            onBlur={() => setFieldTouched('categoryId', true)}
                                            options={categories.map((c) => ({ value: c.id, label: c.name }))}
                                        />
                                    </FormItem>
                                )}
                                <FormItem label="Vencimiento">
                                    <DatePicker
                                        value={values.dueDate}
                                        onChange={(date) => setFieldValue('dueDate', date)}
                                        inputFormat="YYYY-MM-DD"
                                        placeholder="Selecciona la fecha"
                                        size="md"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Prioridad"
                                    invalid={errors.priority && touched.priority}
                                    errorMessage={errors.priority}
                                >
                                    <Select
                                        value={[
                                            { value: 'low', label: 'Baja' },
                                            { value: 'medium', label: 'Media' },
                                            { value: 'high', label: 'Alta' },
                                        ].find((option) => option.value === values.priority)}
                                        onChange={(option) => setFieldValue('priority', option?.value || 'medium')}
                                        onBlur={() => setFieldTouched('priority', true)}
                                        options={[
                                            { value: 'low', label: 'Baja' },
                                            { value: 'medium', label: 'Media' },
                                            { value: 'high', label: 'Alta' },
                                        ]}
                                    />
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
                ¿Desea eliminar esta tarea?
            </ConfirmDialog>
        </div>
    )
}

export default Tasks
