import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, FormItem, FormContainer } from 'components/ui';

import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'utils/hooks/useAuth';
import { Notification, toast } from 'components/ui';
import { setVerificationOn } from 'store/auth/sessionSlice';

const validationSchema = Yup.object().shape({
  code: Yup.string().required(' '),
});

const VerifyForm = () =>
{

  const { verify,getTwoFactorExpiresAt } = useAuth();
  const [ time, setTime ] = useState(180000);
  const hasExpiredRef = useRef(false);
  const dispatch = useDispatch();

  const openNotification = useCallback((type, title, message) => {
    const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200';
    const placement = type === 'success' ? 'top-end' : 'top-end';
    toast.push(
      <Notification className={borderColor} title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
        {message}
      </Notification>, { placement: placement}
    );
  }, []);

  const expireVerification = useCallback(() => {
    if (hasExpiredRef.current) {
      return;
    }

    hasExpiredRef.current = true;
    openNotification('warning', 'Tiempo agotado', 'El tiempo para ingresar el codigo de verificacion ha finalizado. Por favor, ingresa nuevamente tus credenciales');
    dispatch(setVerificationOn(false));
  }, [dispatch, openNotification]);

  const onVerify = async (values, setSubmitting) => {
    const { code } = values;
    setSubmitting(true);

    const result = await verify({ code });

    if (result.status === 200) {
      openNotification('success', '¡Bienvenido!', result.message);
    } else {
      openNotification('danger', 'Error', result.message);
      setSubmitting(false);
    }
  };

  const handleReturnSignIn = () => {
    dispatch(setVerificationOn(false));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchExpiresAt = async () => {
      const resp = await getTwoFactorExpiresAt();
      if (!isMounted || resp.status !== 200) {
        return;
      }

        const expiresAt = new Date(resp.expires_at);
        const now = new Date();
        const remainingTime = expiresAt - now;

        if (remainingTime <= 0) {
          setTime(0);
          expireVerification();
          return;
        }

        hasExpiredRef.current = false;
        setTime(remainingTime);
    };

    fetchExpiresAt();
    return () => {
      isMounted = false;
    };
  }, [expireVerification, getTwoFactorExpiresAt]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          expireVerification();
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expireVerification]);
  

  
  return (
    <div className="className">
      <div className="mb-8">
        <h2 className="mb-1">Código de Verificación</h2>
        <p className='text-xl'>Introduce el último código de verificación enviado a tu correo</p>
      </div>
      <Formik
        initialValues={{
          code: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onVerify(values, setSubmitting);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem className='text-xl text-center' label="" invalid={errors.code && touched.code} errorMessage={errors.code}>
                <Field type="text" className='text-center tracking-widest mb-5' autoComplete="off" name="code" placeholder="XXXXXX" component={Input} />
                <div className={`flex justify-end items-center gap-4 ${ time <= (3000*10) ? 'text-danger' : ( time >= (3000*10) && time <= (6000*10) ? 'text-warning' : 'text') }`}>
                  <div className='w-6/12'></div>
                  <div className={`w-6/12 flex justify-end items-center gap-4`}>
                    <span className='w-10/12 font-semibold'>Tiempo restante:</span>
                    <span className='w-2/12'>{Math.floor(time / 60000)}:{((time % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                  </div>
                </div>
              </FormItem>
              
              <div className="flex justify-between items-center">
                <button className='text-xl m-0 p-0 hover:text-buke-500 hover:cursor-pointer font-semibold bg-transparent border-0' type='button' onClick={handleReturnSignIn}>
                  Regresar a Inicio de Sesión
                </button>
                <div className="w-2/5">
                  <Button className={`text-center`} block loading={isSubmitting} variant="solid" type="submit">
                    {isSubmitting ? 'Verificando...' : 'Verificar'}
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

export default VerifyForm;