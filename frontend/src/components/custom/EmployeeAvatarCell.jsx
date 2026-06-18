import React from 'react'
import useEmployeePhoto from 'utils/hooks/useEmployeePhoto'
import Avatar from 'components/ui/Avatar'
export default function EmployeeAvatarCell({ employee, size = 36 }) {
    const { src } = useEmployeePhoto(employee?.id, {
        format: 'webp',
        mode: 'cover',
        w: size * 2,
        h: size * 2,
        q: 60,
    })

    const initials = `${employee?.name?.[0] ?? ''}${
        employee?.lastname?.[0] ?? ''
    }`
        .trim()
        .toUpperCase()

    return (
        <Avatar
            size={size}
            shape="circle"
            alt={`${employee?.name ?? ''} ${employee?.lastname ?? ''}`}
            src={src || undefined}
        >
            {initials || '—'}
        </Avatar>
    )
}
