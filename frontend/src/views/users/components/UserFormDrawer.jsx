import React from 'react'
import { Drawer, Input, FormItem, FormContainer, Select, Switcher } from 'components/ui'
import { Button } from 'components/custom'
import { Field, Form, Formik } from 'formik'

const UserFormDrawer = ({ isOpen, onClose, editing, formValues, validationSchema, onSubmit, roleOptions }) => {
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
                            <h4>{editing ? 'Editar usuario' : 'Nuevo usuario'}</h4>
                            <p>{editing ? 'Modifica los datos del usuario' : 'Completa los datos del nuevo usuario. La contraseña se generará automáticamente.'}</p>
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
                                    placeholder="Nombre completo"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Correo electrónico"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Rol"
                                invalid={errors.role && touched.role}
                                errorMessage={errors.role}
                            >
                                <Select
                                    placeholder="Selecciona un rol"
                                    value={roleOptions.find((o) => o.value === values.role)}
                                    options={roleOptions}
                                    onChange={(option) => setFieldValue('role', option ? option.value : null)}
                                    onBlur={() => setFieldTouched('role', true)}
                                />
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

export default UserFormDrawer
