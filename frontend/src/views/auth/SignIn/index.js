import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SignInForm from './SignInForm';
import VerifyForm from './VerifyForm';

const SignIn = () => {
    
    const [ identity, setIdentity ] = useState('');
    const [ password, setPassword ] = useState('');
    
    const { verificationOn } = useSelector( state => state.auth.session );
    
    useEffect( () => {}, [ verificationOn ] );
    return (
        <>
        { verificationOn ? <VerifyForm /> : (
            <SignInForm identity={identity} setIdentity={setIdentity} password={password} setPassword={setPassword} />
        )}
        </>
    );
}

export default SignIn;