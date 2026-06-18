import React, { useState } from 'react'
import { Input, Button, FormItem, FormContainer, Alert,  toast, Notification } from 'components/ui'
import { ActionLink } from 'components/shared'
import { apiForgotPassword } from 'services/AuthService'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const NotificationBodyMessage = ({ message }) => {
    if (typeof message !== 'object') {
        return <>{message}</>
    }

    return (
        <ul>
            {Object.entries(message).map(([key, value]) => (
                <li key={key} className='text-justify'>{value[0]}</li>
            ))}
        </ul>
    )
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Por favor, ingresa tu correo electrónico'),
})

const ForgotPasswordForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [emailSent, setEmailSent] = useState(false)

    const [message] = useTimeOutMessage()

    const openNotification = (type,title,message,placement) => {
        toast.push((
            <Notification closable title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <NotificationBodyMessage message={message} />
            </Notification>), {placement: placement}
        )
    }

    const onSendMail = async (values, setSubmitting) => {
        setSubmitting(true)
        try {
            const resp = await apiForgotPassword(values)

            if ( resp ) {
                openNotification('success','Éxito','Correo enviado con éxito','top-start')
                setSubmitting(false)
                setEmailSent(true)
            }
        } catch (errors) {
            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
            setSubmitting(false)
        }
    }

    return (
        <div className={`${className}`}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">Revisa tu correo electrónico</h3>
                        <p>
                            Hemos enviado las instrucciones para recuperar tu contraseña a tu correo
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">¿Olvidaste tu contraseña?</h3>
                        <p>
                            Ingresa tu correo electrónico, las instrucciones para recuperar tu contraseña te seran enviadas
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Correo Electrónico"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className='flex justify-between items-center '>
                                <div className='w-5/12'>
                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {emailSent ? 'Reenviar Correo' : 'Enviar Correo Electrónico'}
                                    </Button>
                                </div>
                                <div className="">
                                    <span>Regresar a </span>
                                    <ActionLink to={signInUrl}>Inicio de Sesión</ActionLink>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
