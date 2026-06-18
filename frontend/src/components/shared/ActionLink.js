import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import useThemeClass from 'utils/hooks/useThemeClass'
import { Link } from 'react-router-dom'

const ActionLink = ({
    children,
    className,
    themeColor = true,
    to,
    href = '',
    ...rest
}) => {

    const { textTheme } = useThemeClass()

    const classNameProps = {
        className: classNames(
            themeColor && textTheme,
            'hover:underline',
            className
        ),
    }

    return to ? (
        <Link to={to} {...classNameProps} {...rest}>
            {children}
        </Link>
    ) : (
        <a href={href} {...classNameProps} {...rest}>
            {children}
        </a>
    )
}

ActionLink.propTypes = {
    themeColor: PropTypes.bool,
    to: PropTypes.string,
}

export default ActionLink