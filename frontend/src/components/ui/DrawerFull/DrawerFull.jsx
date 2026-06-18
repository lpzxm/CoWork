import React from 'react'
import classNames from 'classnames'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import CloseButton from '../CloseButton'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import useWindowSize from '../hooks/useWindowSize'

const DrawerFull = (props) => {
    const {
        children,
        className,
        closable,
        isOpen,
        onClose,
        closeTimeoutMS,
        placement,
        bodyOpenClassName,
        portalClassName,
        overlayClassName,
        title,
        footer,
        headerClass,
        footerClass,
        bodyClass,
        showBackdrop,
        lockScroll,
        ...rest
    } = props

    const { height: windowHeight } = useWindowSize()

    const onCloseClick = (e) => {
        onClose(e)
    }

    const renderCloseButton = <CloseButton onClick={onCloseClick} />

    const getStyle = () => {
        if (placement === 'top' || placement === 'bottom') {
            return {
                dimensionClass: 'horizontal',
                contentStyle: { height: '100vh' },
                motionStyle: {
                    [placement]: `-${windowHeight}${typeof windowHeight === 'number' && 'px'
                        }`,
                },
            }
        }
    }

    const { dimensionClass, contentStyle, motionStyle } = getStyle()

    return (
        <Modal
            className={{
                base: classNames('drawer', className),
                afterOpen: 'drawer-after-open',
                beforeClose: 'drawer-before-close',
            }}
            overlayClassName={{
                base: classNames(
                    'drawer-overlay',
                    overlayClassName,
                    !showBackdrop && 'bg-transparent'
                ),
                afterOpen: 'drawer-overlay-after-open',
                beforeClose: 'drawer-overlay-before-close',
            }}
            portalClassName={classNames('drawer-portal', portalClassName)}
            bodyOpenClassName={classNames(
                'drawer-open',
                lockScroll && 'drawer-lock-scroll',
                bodyOpenClassName
            )}
            ariaHideApp={false}
            isOpen={isOpen}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <LazyMotion features={domAnimation}>
                <m.div
                    className={classNames('drawer-content', dimensionClass)}
                    style={{ ...contentStyle, height: '100%' }}
                    initial={motionStyle}
                    animate={{
                        [placement]: isOpen ? 0 : motionStyle[placement],
                    }}
                >
                    {title || closable ? (
                        <div className={classNames('drawer-header', headerClass)}>
                            {typeof title === 'string' ? (
                                <h4>{title}</h4>
                            ) : (
                                <span>{title}</span>
                            )}
                            {closable && renderCloseButton}
                        </div>
                    ) : null}
                    <div className={classNames('drawer-body', bodyClass)}>
                        {children}
                    </div>
                    {footer && (
                        <div className={classNames('drawer-footer', footerClass)}>
                            {footer}
                        </div>
                    )}
                </m.div>
            </LazyMotion>
        </Modal>
    )
}

DrawerFull.propTypes = {
    placement: PropTypes.oneOf(['top', 'bottom']),
    width: PropTypes.number,
    height: PropTypes.number,
    closable: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headerClass: PropTypes.string,
    footerClass: PropTypes.string,
    bodyClass: PropTypes.string,
    showBackdrop: PropTypes.bool,
    lockScroll: PropTypes.bool,
    bodyOpenClassName: PropTypes.string,
    portalClassName: PropTypes.string,
    overlayClassName: PropTypes.string,
}

DrawerFull.defaultProps = {
    closable: true,
    closeTimeoutMS: 300,
    placement: 'top',
    showBackdrop: true,
    lockScroll: true,
}

export default DrawerFull
