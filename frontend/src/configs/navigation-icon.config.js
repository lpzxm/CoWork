import React from 'react'
import {
    HiHome,
    HiClipboardCheck,
    HiCollection,
    HiShieldCheck,
} from 'react-icons/hi';

const Dgehm = () => {
    return (
        <div className='text-sm'>
            <img src='/img/logo/logo-dark-streamline.png' alt='dgehm' height={10} width={23}/>
        </div>
    )
}

const navigationIcon = {
    home: <HiHome />,
    tasks: <HiClipboardCheck />,
    categories: <HiCollection />,
    permissions: <HiShieldCheck />,
    dgehm: <Dgehm />,
}

export default navigationIcon
