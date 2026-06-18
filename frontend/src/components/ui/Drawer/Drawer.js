import React, { useMemo } from 'react'
import classNames from 'classnames'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import CloseButton from '../CloseButton'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import useWindowSize from '../hooks/useWindowSize'

const Drawer = ({
    children,
    className,
    closable = false,
    width = 400,
    height = 400,
    isOpen,
    onClose,
    closeTimeoutMS = 300,
    placement = 'right',
    bodyOpenClassName,
    portalClassName,
    overlayClassName,
    title,
    footer,
    headerClass,
    footerClass,
    bodyClass,
    showBackdrop = true,
    lockScroll = true,
    ...rest
}) => {
    const onCloseClick = (e) => {
        onClose(e)
    }

    const { width: viewportWidth } = useWindowSize()

    const drawerWidth = useMemo(() => {
        if (typeof viewportWidth !== 'number') {
            return width
        }

        return viewportWidth < 768 ? viewportWidth : viewportWidth * 0.5
    }, [viewportWidth, width])

    const renderCloseButton = <CloseButton onClick={onCloseClick} />

    const getStyle = () => {
        if (placement === 'left' || placement === 'right') {
            const customWidth = drawerWidth
            return {
                dimensionClass: 'vertical',
                contentStyle: { width: customWidth },
                motionStyle: {
                    [placement]: `-${customWidth}${typeof customWidth === 'number' && 'px'}`,
                },
            }
        }

        if (placement === 'top' || placement === 'bottom') {
            return {
                dimensionClass: 'horizontal',
                contentStyle: { height },
                motionStyle: {
                    [placement]: `-${height}${typeof height === 'number' && 'px'}`,
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
                    style={contentStyle}
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

Drawer.propTypes = {
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
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

export default Drawer