import React, { useRef, forwardRef, useState } from 'react'
import classNames from 'classnames'
import useMergedRef from '../hooks/useMergeRef'
import { clamp } from './utils/clamp'
import { padTime } from './utils/padTime'

const TimeInputField = forwardRef((props, ref) => {
    const {
        className,
        onFocus,
        onBlur,
        onChange,
        setValue,
        withSeparator = false,
        max,
        min = 0,
        value,
        ...rest
    } = props

    const [digitsEntered, setDigitsEntered] = useState(0)

    const inputRef = useRef()

    const selectInputOnFocus = (event) => {
        typeof onFocus === 'function' && onFocus(event)
        inputRef.current.select()
        setDigitsEntered(0)
    }

    const commitSingleDigitOnBlur = (event) => {
        typeof onBlur === 'function' && onBlur(event)
        if (digitsEntered === 1) {
            typeof onChange === 'function' &&
                onChange(event.currentTarget.value, false)
        }
    }

    const selectInputOnClick = (event) => {
        event.stopPropagation()
        inputRef.current.select()
    }

    const stepTimeValueWithKeyboard = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            const padded = padTime(
                clamp(
                    parseInt(event.currentTarget.value, 10) + 1,
                    min,
                    max
                ).toString()
            )

            if (value !== padded) {
                onChange(padded, false)
            }
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            const padded = padTime(
                clamp(
                    parseInt(event.currentTarget.value, 10) - 1,
                    min,
                    max
                ).toString()
            )

            if (value !== padded) {
                onChange(padded, false)
            }
        }
    }

    const updateTimeDigits = (event) => {
        setDigitsEntered((current) => current + 1)

        const _val = parseInt(event.currentTarget.value, 10).toString()

        if (_val === '0' && digitsEntered === 0) {
            setValue('00')
            return
        }
        onChange(_val, true, digitsEntered > 0)
    }

    return (
        <>
            <input
                type="text"
                inputMode="numeric"
                ref={useMergedRef(inputRef, ref)}
                onChange={updateTimeDigits}
                onClick={selectInputOnClick}
                onFocus={selectInputOnFocus}
                onBlur={commitSingleDigitOnBlur}
                onKeyDown={stepTimeValueWithKeyboard}
                value={value}
                className={classNames('time-input-field', className)}
                {...rest}
            />
            {withSeparator && <span> : </span>}
        </>
    )
})

export default TimeInputField
