import React, { useState, useContext, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '../ConfigProvider'
import { CollapseContextProvider } from './context/collapseContext'
import classNames from 'classnames'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import MenuContext from './context/menuContext'
import { HiChevronDown } from 'react-icons/hi'

const MenuCollapse = ({
    children,
    className,
    eventKey,
    expanded = false,
    label = null,
    onToggle,
}) => {
    const { menuItemHeight, variant, sideCollapsed, defaultExpandedKeys } =
        useContext(MenuContext)

    const { direction } = useConfig()

    const [isExpanded, setIsExpanded] = useState(
        () => expanded || defaultExpandedKeys.includes(eventKey)
    )

    const toggleMenuCollapse = useCallback(
        (event) => {
            const nextExpanded = !isExpanded
            onToggle?.(nextExpanded, event)
            setIsExpanded(nextExpanded)
        },
        [isExpanded, onToggle]
    )

    const childrenHeight = useMemo(() => {
        if (!isExpanded) {
            return 0
        }

        return React.Children.count(children) * menuItemHeight
    }, [children, isExpanded, menuItemHeight])

    const menuCollapseItemClass = classNames(
        'menu-collapse-item',
        `menu-collapse-item-${variant}`,
        'w-full',
        className
    )

    return (
        <div className="menu-collapse">
            <button
                type="button"
                className={menuCollapseItemClass}
                onClick={toggleMenuCollapse}
                aria-expanded={isExpanded}
            >
                <span className="flex items-center">{label}</span>
                <LazyMotion features={domAnimation}>
                    <m.span
                        className="text-lg mt-1"
                        initial={{ transform: 'rotate(0deg)' }}
                        animate={{
                            transform: isExpanded
                                ? 'rotate(-180deg)'
                                : 'rotate(0deg)',
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        {sideCollapsed ? null : <HiChevronDown />}
                    </m.span>
                </LazyMotion>
            </button>
            <CollapseContextProvider value={isExpanded}>
                <LazyMotion features={domAnimation}>
                    <m.ul
                        className={direction === 'rtl' ? 'mr-5' : 'ml-5'}
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            height: childrenHeight,
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        {children}
                    </m.ul>
                </LazyMotion>
            </CollapseContextProvider>
        </div>
    )
}

MenuCollapse.propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node,
    className: PropTypes.string,
}

export default MenuCollapse