import React from 'react';
import Button from 'components/custom/Button';
import { Input, Checkbox, FormItem, FormContainer } from 'components/ui';
import { PasswordInput, ActionLink } from 'components/shared';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'utils/hooks/useAuth';
import { Notification, toast } from 'components/ui';

const validationSchema = Yup.object().shape({
  identity: Yup.string().required('Ingresa tu Correo o Nombre de Usuario'),
  password: Yup.string().required('Ingresa tu contraseña'),
  rememberMe: Yup.bool(),
});

const SignInForm = ({ identity, setIdentity, password, setPassword, disableSubmit = false, className, forgotPasswordUrl = '/forgot-password' }) => {

  const { authentication } = useAuth();

  const onSignIn = async (values, setSubmitting) => {

    const { identity, password } = values;

    setSubmitting(true);
    
    const result = await authentication({ identity, password });

    if (result.status === 200) {
      openNotification('success', 'Valida tu sesión', result.message);
    } else {
      openNotification('danger', 'Error', result.message);
      setSubmitting(false);
    }

  };

  const openNotification = (type, title, message) => {
    const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200';
    toast.push(
      <Notification className={borderColor} title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
        {message}
      </Notification>, { placement: 'top-end'}
    );
  };

  return (
    <div className={className}>
      <div className=''>
        <h2 className='mb-1'>¡Bienvenido!</h2>
        <h3 className='mb-1'>Sistema DGEHM</h3>
      </div>
      <hr className='my-6' />
      <p className='mt-3 mb-8'>Por favor, introduce tus credenciales para ingresar</p>
      
      <Formik
        initialValues={{
          identity,
          password,
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setIdentity(values.identity);
          setPassword(values.password);
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem label='Correo electrónico o usuario' invalid={errors.identity && touched.identity} errorMessage={errors.identity}>
                <Field type='text' autoComplete='off' name='identity' placeholder='' component={Input} />
              </FormItem>
              <FormItem label='Contraseña' invalid={errors.password && touched.password} errorMessage={errors.password}>
                <Field autoComplete='off' name='password' placeholder='' component={PasswordInput} />
              </FormItem>
              <div className='flex justify-between mb-6'>
                <Field className='mb-0 ' name='rememberMe' component={Checkbox}>Recordarme</Field>
                <ActionLink className='text-center' to={forgotPasswordUrl}>
                  ¿Olvidaste la contraseña?
                </ActionLink>
              </div>
              <div className='flex justify-end'>
                <div className='w-2/5'>
                  <Button block loading={isSubmitting} variant='plain' type='submit' color="primary" disabled={isSubmitting || disableSubmit}>
                    { isSubmitting ? 'Verificando...' : 'Ingresar' }
                  </Button>
                </div>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignInForm;
