import React, { useState } from 'react'
import { Button, FormItem, FormContainer, Input} from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import { apiResetPassword } from 'services/AuthService'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Notification, toast} from 'components/ui'


const validationSchema = Yup.object().shape({
    password: Yup.string().required('Ingresa tu contraseña, por favor'),
    email: Yup.string().required('Ingresa tu correo electrónico, por favor'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password_confirmation'), null],
        'Las contraseñas no coinciden'
    ),
})

const ResetPasswordForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [resetComplete, setResetComplete] = useState(false)

    const navigate = useNavigate()

    const onSubmit = async (values, setSubmitting) => {
        const { password,password_confirmation,email } = values

         // Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        // Check if the token exists
        if (!token) {
            openNotification('danger','Error','No se encuentra un token válido','top-start');
            setSubmitting(false);
            return;
        }

        setSubmitting(true)
        try {
            const resp = await apiResetPassword({ password,password_confirmation,email,token })
            if (resp.data) {
                setSubmitting(false)
                setResetComplete(true)
            }
        } catch (errors) {

            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
            // setMessage(errors?.response?.data?.message || errors.toString())
            setSubmitting(false)
        }
    }

    const onContinue = () => {
        navigate('/sign-in')
    }

    const openNotification = (type,title,message) => {
		toast.push(
			<Notification className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
				{message}
			</Notification>
		)

	}

    return (
        <div className={className}>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">¡Listo!</h3>
                        <p>Tu contraseña se restableció con éxito</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Restablecer contraseña</h3>
                        <p>
                            Por favor, llena los campos que se te solicitan en el siguiente formulario. La contraseña debe ser diferente a la actual
                        </p>
                    </>
                )}
            </div>
            {/* {message && openNotification('danger','Error',message)} */}
            <Formik
                initialValues={{
                    email:'',
                    password: '',
                    password_confirmation: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!resetComplete ? (
                                <>
                                    <FormItem
                                        label="Correo Electrónico"
                                        invalid={
                                            errors.email && touched.email
                                        }
                                        errorMessage={errors.email}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="email"
                                            placeholder="Correo Electrónico"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Contraseña"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Confirmar Contraseña"
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password_confirmation"
                                            placeholder="Confirmar Contraseña"
                                            component={PasswordInput}
                                        />
                                    </FormItem>

                                    <div className='flex justify-between items-center '>
                                        <div className='w-5/12'>
                                            <Button
                                                block
                                                loading={isSubmitting}
                                                variant="solid"
                                                type="submit"
                                            >
                                                {isSubmitting
                                                    ? 'Enviando...'
                                                    : 'Restablecer'}
                                            </Button>
                                        </div>
                                        <div className="">
                                            <span>Regresar a </span>
                                            <ActionLink to={signInUrl}>Inicio de Sesión</ActionLink>
                                        </div>
                                    </div>
                                    
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                >
                                    Continuar
                                </Button>
                            )}

                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPasswordForm
