import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import { Popper, Reference, Manager } from 'react-popper'
import {
    AnimatePresence,
    LazyMotion,
    domAnimation,
    m,
    useReducedMotion,
} from 'framer-motion'
import Arrow from './Arrow'
import PropTypes from 'prop-types'
import { Portal } from 'react-portal'

const PopperElement = ({ title }) => <span>{title}</span>

const Tooltip = ({
    className,
    children,
    title,
    placement = 'top',
    wrapperClass,
    isOpen,
    ...rest
}) => {
    const prefersReducedMotion = useReducedMotion()

    const [internalTooltipOpen, setInternalTooltipOpen] = useState(
        () => isOpen ?? false
    )
    const tooltipOpen = typeof isOpen === 'boolean' ? isOpen : internalTooltipOpen

    const tooltipBackground = 'gray-800'
    const tooltipDarkBackground = 'black'

    const defaultTooltipClass = `tooltip bg-${tooltipBackground} dark:bg-${tooltipDarkBackground}`

    const toggleTooltip = useCallback(
        (bool) => {
            if (typeof isOpen === 'undefined') {
                setInternalTooltipOpen(bool)
            }
        },
        [isOpen]
    )

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <span
                        className={classNames('tooltip-wrapper', wrapperClass)}
                        ref={ref}
                        onMouseEnter={() => toggleTooltip(true)}
                        onMouseLeave={() => toggleTooltip(false)}
                    >
                        {children}
                    </span>
                )}
            </Reference>
            {tooltipOpen && (
                <Portal>
                    <Popper
                        placement={placement}
                        modifiers={[
                            { name: 'arrow', options: { element: Arrow } },
                            { name: 'offset', options: { offset: [0, 7] } },
                        ]}
                        strategy={'fixed'}
                    >
                        {({ ref, style, forceUpdate, ...popperProps }) => (
                            <LazyMotion features={domAnimation}>
                                <AnimatePresence>
                                    <m.div
                                        className={defaultTooltipClass}
                                        ref={(node) => {
                                            ref(node)
                                            if (node) {
                                                forceUpdate?.()
                                            }
                                        }}
                                        style={style}
                                        initial={{
                                            opacity: 0,
                                            visibility: 'hidden',
                                        }}
                                        animate={
                                            tooltipOpen
                                                ? {
                                                      opacity: 1,
                                                      visibility: 'visible',
                                                  }
                                                : {
                                                      opacity: 0,
                                                      visibility: 'hidden',
                                                  }
                                        }
                                        transition={{
                                            duration: prefersReducedMotion ? 0 : 0.15,
                                            type: 'tween',
                                        }}
                                    >
                                        <PopperElement
                                            title={title}
                                            {...rest}
                                            {...popperProps}
                                        />
                                        <Arrow
                                            placement={placement}
                                            color={tooltipBackground}
                                            colorDark={tooltipDarkBackground}
                                        />
                                    </m.div>
                                </AnimatePresence>
                            </LazyMotion>
                        )}
                    </Popper>
                </Portal>
            )}
        </Manager>
    )
}

Tooltip.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    placement: PropTypes.oneOf([
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
    ]),
    wrapperClass: PropTypes.string,
    isOpen: PropTypes.bool,
}

export default Tooltip
