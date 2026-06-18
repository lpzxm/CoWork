import React from 'react'
import Modal from 'react-modal'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CloseButton from '../CloseButton'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { twScreens } from 'utils/tailwindTheme'
import useWindowSize from '../hooks/useWindowSize'

const Dialog = ({
    children,
    className,
    closable = true,
    width = 520,
    height,
    style,
    isOpen,
    onClose,
    bodyOpenClassName,
    portalClassName,
    overlayClassName,
    contentClassName,
    closeTimeoutMS = 150,
    ...rest
}) => {
    const currentSize = useWindowSize()


    const onCloseClick = (e) => {
        onClose(e)
    }

    const renderCloseButton = (
        <CloseButton
            onClick={onCloseClick}
            className="ltr:right-6 rtl:left-6"
            absolute
        />
    )

    const contentStyle = {
        content: {
            inset: 'unset',
        },
        ...style,
    }

    if (width !== undefined) {
        contentStyle.content.width = width

        if (
            currentSize.width <=
            parseInt(String(twScreens.sm).split(/ /)[0].replace(/[^\d]/g, ''), 10)
        ) {
            contentStyle.content.width = 'auto'
        }
    }
    if (height !== undefined) {
        contentStyle.content.height = height
    }

    const defaultDialogContentClass = 'dialog-content'

    const dialogClass = classNames(defaultDialogContentClass, contentClassName)

    return (
        <Modal
            className={{
                base: classNames('dialog', className),
                afterOpen: 'dialog-after-open',
                beforeClose: 'dialog-before-close',
            }}
            overlayClassName={{
                base: classNames('dialog-overlay', overlayClassName),
                afterOpen: 'dialog-overlay-after-open',
                beforeClose: 'dialog-overlay-before-close',
            }}
            portalClassName={classNames('dialog-portal', portalClassName)}
            bodyOpenClassName={classNames('dialog-open', bodyOpenClassName)}
            ariaHideApp={false}
            isOpen={isOpen}
            style={{ ...contentStyle }}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <LazyMotion features={domAnimation}>
                <m.div
                    className={dialogClass}
                    initial={{ transform: 'scale(0.9)' }}
                    animate={{
                        transform: isOpen ? 'scale(1)' : 'scale(0.9)',
                    }}
                >
                    {closable && renderCloseButton}
                    {children}
                </m.div>
            </LazyMotion>
        </Modal>
    )
}

Dialog.propTypes = {
    closable: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    overlayClassName: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    portalClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    closeTimeoutMS: PropTypes.number,
    bodyOpenClassName: PropTypes.string,
}

export default Dialog