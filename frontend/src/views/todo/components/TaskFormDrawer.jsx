import React from 'react'
import { Drawer, Input, Select, DatePicker, FormItem, FormContainer } from 'components/ui'
import { Button } from 'components/custom'
import { Field, Form, Formik } from 'formik'
import { HiPaperClip, HiTrash } from 'react-icons/hi'

const TaskFormDrawer = ({
    isOpen,
    onClose,
    editing,
    formValues,
    validationSchema,
    onSubmit,
    statusOptions,
    coordinatorOptions,
    tasks,
    handleDeleteExistingFile,
    deletingFileId,
    handleFileSelect,
    selectedFiles,
    removeSelectedFile,
}) => {
    return (
        <Formik
            enableReinitialize
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ touched, errors, values, setFieldValue, setFieldTouched, isSubmitting, submitForm }) => (
                <Drawer
                    isOpen={isOpen}
                    onClose={onClose}
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
                            <Button size="sm" variant="solid" color="secondary" onClick={onClose}>
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
    )
}

export default TaskFormDrawer
