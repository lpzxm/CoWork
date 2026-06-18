import React from 'react'
import {
    HiHome,
    HiClipboardCheck,
    HiCollection,
    HiBadgeCheck,
    HiUserGroup,
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
    users: <HiUserGroup />,
    tasks: <HiClipboardCheck />,
    categories: <HiCollection />,
    statuses: <HiBadgeCheck />,
    dgehm: <Dgehm />,
}

export default navigationIcon
