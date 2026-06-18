import React, { useState } from 'react'
import { Input } from 'components/ui'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'

const PasswordInput = (props) => {
    const { onVisibleChange, ...rest } = props

    const [pwInputType, setPwInputType] = useState('password')

    const onPasswordVisibleClick = (e) => {
        e.preventDefault()
        const nextValue = pwInputType === 'password' ? 'text' : 'password'
        setPwInputType(nextValue)
        onVisibleChange?.(nextValue === 'text')
    }

    const onPasswordVisibleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onPasswordVisibleClick(e)
        }
    }

    return (
        <Input
            {...rest}
            type={pwInputType}
            suffix={
                <button
                    type="button"
                    className="cursor-pointer text-xl"
                    onClick={(e) => onPasswordVisibleClick(e)}
                    onKeyDown={onPasswordVisibleKeyDown}
                    aria-label={
                        pwInputType === 'password'
                            ? 'Show password'
                            : 'Hide password'
                    }
                >
                    {pwInputType === 'password' ? (
                        <HiOutlineEyeOff />
                    ) : (
                        <HiOutlineEye />
                    )}
                </button>
            }
        />
    )
}

export default PasswordInput
