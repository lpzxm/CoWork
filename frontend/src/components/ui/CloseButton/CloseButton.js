import React from 'react'
import { HiX } from 'react-icons/hi'
import classNames from 'classnames'

const CloseButton = React.forwardRef((props, ref) => {
    const { absolute, className, defaultStyle, svgClass, ...rest } = props
    const closeButtonAbsoluteClass = 'absolute z-10'

    const closeButtonClass = classNames(
        'close-btn',
        defaultStyle && 'close-btn-default',
        absolute && closeButtonAbsoluteClass,
        className
    )

    return (
        <button
            type="button"
            className={closeButtonClass}
            aria-label="Close"
            {...rest}
            ref={ref}
        >
            <HiX />
        </button>
    )
})

CloseButton.defaultProps = {
    defaultStyle: true,
}

export default CloseButton
