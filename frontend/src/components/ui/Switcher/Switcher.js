import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Spinner from '../Spinner'
import { useConfig } from '../ConfigProvider'

const Switcher = forwardRef((props, ref) => {
    const {
        checked,
        checkedContent,
        className,
        color,
        defaultChecked,
        disabled,
        isLoading,
        labelRef,
        name,
        onChange,
        readOnly,
        unCheckedContent,
        field,
        ...rest
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isControlled = typeof checked !== 'undefined'

    const getControlProps = () => {
        let checkedValue = isControlled ? checked : internalChecked

        let nextControlProps = { value: checkedValue }

        if (field) {
            checkedValue =
                typeof field.value === 'boolean' ? field.value : defaultChecked
            nextControlProps = { value: checkedValue, checked: checkedValue }
        }

        if (defaultChecked) {
            nextControlProps.defaultChecked = defaultChecked
        }
        return nextControlProps
    }

    const controlProps = getControlProps()
    const switcherChecked = controlProps.checked ?? controlProps.value

    const toggleSwitcherValue = (e) => {
        const nextChecked = !switcherChecked

        if (disabled || readOnly || isLoading) {
            return
        }

        if (typeof checked === 'undefined') {
            setInternalChecked(nextChecked)
            onChange?.(nextChecked, e)
        } else {
            onChange?.(nextChecked, e)
        }
    }

    const switcherColor = color || `${themeColor}-${primaryColorLevel}`

    const switcherClass = classNames(
        'switcher',
        (switcherChecked || controlProps.checked) &&
            `switcher-checked bg-${switcherColor} dark:bg-${switcherColor}`,
        disabled && 'switcher-disabled',
        className
    )

    return (
        <label ref={labelRef} className={switcherClass}>
            <input
                ref={ref}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                onChange={toggleSwitcherValue}
                name={name}
                {...controlProps}
                {...field}
                {...rest}
            />
            {isLoading ? (
                <Spinner
                    className={classNames(
                        'switcher-toggle-loading',
                        switcherChecked
                            ? 'switcher-checked-loading'
                            : 'switcher-uncheck-loading'
                    )}
                />
            ) : (
                <div className="switcher-toggle" />
            )}
            <span className="switcher-content">
                {switcherChecked ? checkedContent : unCheckedContent}
            </span>
        </label>
    )
})

Switcher.defaultProps = {
    isLoading: false,
}

Switcher.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    isLoading: PropTypes.bool,
    color: PropTypes.string,
    onChange: PropTypes.func,
    checkedContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    unCheckedContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    labelRef: PropTypes.string,
}

export default Switcher
