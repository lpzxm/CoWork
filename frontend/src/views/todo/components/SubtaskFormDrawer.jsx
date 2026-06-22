import React from 'react'
import dayjs from 'dayjs'
import { Drawer, Input, Select, DatePicker, FormItem, FormContainer } from 'components/ui'
import { Button } from 'components/custom'
import { Field, Form, Formik } from 'formik'
import { HiPaperClip, HiEye, HiDownload, HiTrash } from 'react-icons/hi'

const SubtaskFormDrawer = ({
    isOpen,
    onClose,
    editingSubtask,
    subtaskFormValues,
    validationSchema,
    onSubmit,
    statusOptions,
    subtasks,
    handlePreviewFile,
    handleDownloadFile,
    handleDeleteSubtaskFile,
    subtaskNewFiles,
    setSubtaskNewFiles,
}) => {
    return (
        <Formik
            enableReinitialize
            initialValues={subtaskFormValues}
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
                            <h4 className="mb-2">{editingSubtask ? 'Editar subtarea' : 'Nueva subtarea'}</h4>
                            <p>Completa los datos de la subtarea</p>
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
                            {editingSubtask && (() => {
                                const current = subtasks.find((s) => s.id === editingSubtask)
                                if (!current) return null
                                return (
                                    <FormItem label="Creado por">
                                        <div className="text-sm text-slate-600 dark:text-slate-300">
                                            <span className="font-medium">{current.created_by?.name || 'Desconocido'}</span>
                                            <span className="mx-1.5 text-slate-400">·</span>
                                            <span className="text-slate-400">
                                                {current.created_at ? dayjs(current.created_at).format('DD/MM/YYYY') : '-'}
                                            </span>
                                        </div>
                                    </FormItem>
                                )
                            })()}
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
                                    minDate={new Date()}
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
                                                <div key={f.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <HiPaperClip className="text-slate-400 flex-shrink-0" />
                                                            <span className="truncate">{f.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
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
                                                    {f.uploaded_by && (
                                                        <div className="mt-1 text-[10px] text-slate-400 leading-tight">
                                                            subido por {f.uploaded_by.name} · {dayjs(f.created_at).format('DD/MM/YYYY')}
                                                        </div>
                                                    )}
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
    )
}

export default SubtaskFormDrawer
