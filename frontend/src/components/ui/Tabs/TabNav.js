import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { useTabs } from './context'
import useCallbackRef from '../hooks/useCallbackRef'
import { useConfig } from '../ConfigProvider'
import PropTypes from 'prop-types'
import { HiCheckCircle } from 'react-icons/hi'

const TabNav = forwardRef((props, ref) => {
    const {
        value: valueProp,
        disabled,
        className,
        icon,
        children,
        showSelectedIcon=false,
        ...rest
    } = props

    const { value, onValueChange, variant } = useTabs()
    const isSelected = valueProp === value

    const { themeColor, primaryColorLevel } = useConfig()

    const onTabNavClick = useCallbackRef(() => {
        if (!isSelected && !disabled) {
            onValueChange(valueProp)
        }
    })

    const onTabNavKeyDown = useCallbackRef((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onTabNavClick()
        }
    })

    const color = `${themeColor}-${primaryColorLevel}`

    const tabNavClass = classNames(
        'tab-nav',
        `tab-nav-${variant}`,
        isSelected &&
            `tab-nav-active text-${color} dark:text-${themeColor}-100`,
        isSelected && variant === 'underline' && `border-${color}`,
        isSelected &&
            variant === 'pill' &&
            `bg-${themeColor}-50 dark:bg-${color} dark:text-gray-100`,
        disabled && 'tab-nav-disabled',
        !disabled &&
            !isSelected &&
            `hover:text-${color} dark:hover:text-${themeColor}-100`,
        className
    )

    return (
        <div
            className={`${tabNavClass}`}
            role="tab"
            aria-selected={isSelected}
            tabIndex={disabled ? -1 : 0}
            ref={ref}
            onClick={onTabNavClick}
            onKeyDown={onTabNavKeyDown}
            {...rest}
        >
            { isSelected && showSelectedIcon && <HiCheckCircle className='mr-2' />}
            {icon && <div className="tab-nav-icon">{icon}</div>}
            {children}
        </div>
    )
})

TabNav.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    showSelectedIcon:PropTypes.bool
}

export default TabNav
