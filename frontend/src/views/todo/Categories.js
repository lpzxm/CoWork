import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Button } from 'components/custom'
import { Drawer, Input, FormItem, FormContainer, Notification, toast } from 'components/ui'
import Tag from 'components/ui/Tag'
import ConfirmDialog from 'components/custom/ConfirmDialog'
import DataTable from 'components/custom/DataTable'
import { HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi'
import {
    apiGetTaskCategories,
    apiCreateTaskCategory,
    apiUpdateTaskCategory,
    apiDeleteTaskCategory,
} from 'services/TodoService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const COLOR_OPTIONS = [
    { label: 'Azul', value: '#3B82F6' },
    { label: 'Esmeralda', value: '#10B981' },
    { label: 'Naranja', value: '#F97316' },
    { label: 'Rosa', value: '#EC4899' },
    { label: 'Violeta', value: '#8B5CF6' },
    { label: 'Gris', value: '#64748B' },
]

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Ingresa el nombre de la categoria'),
    description: Yup.string().nullable(),
    color: Yup.string()
        .oneOf(COLOR_OPTIONS.map((option) => option.value))
        .required('Selecciona un color'),
})

const resolvePaletteColor = (value) => {
    const palette = COLOR_OPTIONS.map((option) => option.value)
    return palette.includes(value) ? value : COLOR_OPTIONS[0].value
}

const Categories = () => {
    const dispatch = useDispatch()
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        color: COLOR_OPTIONS[0].value,
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
            description: category.description || '',
        }
    }, [])

    const loadCategories = useCallback(async () => {
        setIsLoading(true)
        setLoadError('')
        try {
            const response = await apiGetTaskCategories()
            const data = response?.data?.data ?? []
            setCategories(data.map(normalizeCategory))
        } catch (err) {
            setLoadError('No se pudieron cargar las categorias.')
            console.log(err);
            
        } finally {
            setIsLoading(false)
        }
    }, [normalizeCategory])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    const openNew = () => {
        setEditing(null)
        setFormValues({
            name: '',
            description: '',
            color: COLOR_OPTIONS[0].value,
        })
        setShowForm(true)
    }

    const openEdit = useCallback((cat) => {
        setEditing(cat.id)
        setFormValues({
            name: cat.name,
            description: cat.description || '',
            color: resolvePaletteColor(cat.color),
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
                header: 'Descripción',
                accessorKey: 'description',
                cell: ({ row }) => row.original.description || '-',
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
            description: values.description?.trim() || '',
            color: values.color,
        }

        setSubmitting(true)
        try {
            if (editing) {
                await apiUpdateTaskCategory(editing, payload)
                openNotification('success', 'Éxito', 'Categoría actualizada correctamente')
            } else {
                await apiCreateTaskCategory(payload)
                openNotification('success', 'Éxito', 'Categoría creada correctamente')
            }

            await loadCategories()
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

            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo guardar la categoria.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await apiDeleteTaskCategory(id)
            openNotification('success', 'Éxito', 'Categoría eliminada correctamente')
            await loadCategories()
        } catch (err) {
            openNotification('danger', 'Error', err?.response?.data?.message || 'No se pudo eliminar la categoria.')
        } finally {
            setConfirmDelete({ open: false, id: null })
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Categorías</h3>
            </div>

            {isLoading && <div className="text-center">Cargando...</div>}
            {!isLoading && loadError && <div className="text-center text-red-600">{loadError}</div>}
            {!isLoading && !loadError && (
                <DataTable
                    columns={columns}
                    data={categories}
                    RightContent={
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={openNew}
                            icon={<HiPlusCircle className="text-2xl" />}
                        >
                            Nueva categoría
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
                                <h4>{editing ? 'Editar categoría' : 'Nueva categoría'}</h4>
                                <p>Completa los datos de la categoría</p>
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
                                    label="Nombre"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Nombre"
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
                                <FormItem
                                    label="Color"
                                    invalid={errors.color && touched.color}
                                    errorMessage={errors.color}
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {COLOR_OPTIONS.map((option) => {
                                            const isSelected = values.color === option.value
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setFieldValue('color', option.value)
                                                        setFieldTouched('color', true, false)
                                                    }}
                                                    className={
                                                        `flex items-center gap-2 rounded-md border px-2 py-2 text-sm transition ` +
                                                        `border-slate-200 dark:border-slate-700 ` +
                                                        `${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : 'hover:border-slate-300 dark:hover:border-slate-600'}`
                                                    }
                                                    aria-pressed={isSelected}
                                                >
                                                    <span
                                                        className="h-4 w-4 rounded-full border border-black/10 dark:border-white/10"
                                                        style={{ backgroundColor: option.value }}
                                                    />
                                                    <span className="truncate">{option.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    </Drawer>
                )}
            </Formik>

            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Eliminar categoría"
                type="danger"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
            >
                Esta acción no se puede deshacer y eliminará también las tareas asociadas a esta categoría.
            </ConfirmDialog>
        </div>
    )
}

export default Categories
