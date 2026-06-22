import React, { useRef } from 'react'
import { Drawer, Input, FormItem, FormContainer, Switcher } from 'components/ui'
import { Button } from 'components/custom'
import { Field, Form, Formik } from 'formik'

const PRESET_COLORS = [
    '#3B82F6', '#10B981', '#F97316', '#EF4444',
    '#8B5CF6', '#EAB308', '#EC4899', '#06B6D4', '#64748B',
]

const StatusFormDrawer = ({ isOpen, onClose, editing, formValues, validationSchema, onSubmit }) => {
    const colorInputRef = useRef(null)

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
                            <h4>{editing ? 'Editar estado' : 'Nuevo estado'}</h4>
                            <p>Completa los datos del estado</p>
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
                                label="Nombre"
                                invalid={errors.name && touched.name}
                                errorMessage={errors.name}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Nombre del estado"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Color"
                                invalid={errors.color && touched.color}
                                errorMessage={errors.color}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => colorInputRef.current?.click()}
                                        className="h-10 w-10 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-sm cursor-pointer transition hover:scale-105 flex-shrink-0"
                                        style={{ backgroundColor: values.color }}
                                        title="Haz clic para elegir un color"
                                    />
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">{values.color}</span>
                                    <input
                                        ref={colorInputRef}
                                        type="color"
                                        value={values.color}
                                        onChange={(e) => {
                                            setFieldValue('color', e.target.value)
                                            setFieldTouched('color', true, false)
                                        }}
                                        className="sr-only"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => {
                                                setFieldValue('color', c)
                                                setFieldTouched('color', true, false)
                                            }}
                                            className={`h-7 w-7 rounded-full border-2 transition hover:scale-110 ${values.color === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </FormItem>
                            <FormItem label="Activo">
                                <Switcher
                                    name="active"
                                    checked={values.active}
                                    onChange={(checked) => setFieldValue('active', checked)}
                                />
                            </FormItem>
                        </FormContainer>
                    </Form>
                </Drawer>
            )}
        </Formik>
    )
}

export default StatusFormDrawer
