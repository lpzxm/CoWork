import React from 'react'
import { Spinner } from 'components/ui'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const DefaultLoading = ({
    loading = false,
    children,
    spinnerClass,
    className,
    asElement: Component = 'div',
    customLoader,
}) => {
    return loading ? (
        <Component
            className={classNames(
                !customLoader && 'flex items-center justify-center h-full',
                className
            )}
        >
            {customLoader ? (
                <>{customLoader}</>
            ) : (
                <Spinner className={spinnerClass} size={40} />
            )}
        </Component>
    ) : (
        <>{children}</>
    )
}

const CoveredLoading = ({
    loading = false,
    children,
    spinnerClass,
    className,
    asElement: Component = 'div',
    customLoader,
}) => {
    return (
        <Component className={classNames(loading ? 'relative' : '', className)}>
            {children}
            {loading && (
                <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />
            )}
            {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    {customLoader ? (
                        <>{customLoader}</>
                    ) : (
                        <Spinner className={spinnerClass} size={40} />
                    )}
                </div>
            )}
        </Component>
    )
}

const Loading = ({
    loading = false,
    spinnerClass,
    type = 'default',
    customLoader,
    children,
    className,
    asElement = 'div'
}) => {
    switch (type) {
        case 'default':
            return (
                <DefaultLoading
                    loading={loading}
                    spinnerClass={spinnerClass}
                    className={className}
                    asElement={asElement}
                    customLoader={customLoader}
                >
                    {children}
                </DefaultLoading>
            )
        case 'cover':
            return (
                <CoveredLoading
                    loading={loading}
                    spinnerClass={spinnerClass}
                    className={className}
                    asElement={asElement}
                    customLoader={customLoader}
                >
                    {children}
                </CoveredLoading>
            )
        default:
            return (
                <DefaultLoading
                    loading={loading}
                    spinnerClass={spinnerClass}
                    className={className}
                    asElement={asElement}
                    customLoader={customLoader}
                >
                    {children}
                </DefaultLoading>
            )
    }
}

Loading.propTypes = {
    loading: PropTypes.bool,
    spinnerClass: PropTypes.string,
    type: PropTypes.oneOf(['default', 'cover']),
    customLoader: PropTypes.node,
}

export default Loading
