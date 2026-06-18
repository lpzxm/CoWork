import React, { useContext } from 'react'
import { MenuContextProvider } from './context/menuContext'
import useUncertainRef from '../hooks/useUncertainRef'
import DropdownMenuContext, {
    useDropdownMenuContext,
    DropdownMenuContextProvider,
} from './context/dropdownMenuContext'
import useUniqueId from '../hooks/useUniqueId'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'

const Menu = React.forwardRef((props, ref) => {
    const {
        children,
        classPrefix,
        activeKey,
        onSelect,
        onKeyDown,
        hidden,
        placement,
        menuClass,
        ...rest
    } = props

    const menuRef = useUncertainRef(ref)
    const menuId = useUniqueId('menu-')
    const upperMenuControl = useContext(DropdownMenuContext)
    const menuControl = useDropdownMenuContext(menuRef, upperMenuControl)

    const getTransform = (deg) => {
        let rotate = `rotateX(${deg}deg)`
        if (placement && placement.includes('center')) {
            return `${rotate} translateX(-50%)`
        }
        return rotate
    }

    const enterStyle = {
        opacity: 1,
        visibility: 'visible',
        transform: getTransform(0),
    }
    const exitStyle = {
        opacity: 0,
        visibility: 'hidden',
        transform: getTransform(40),
    }
    const initialStyle = exitStyle

    return (
        <MenuContextProvider
            value={{
                activeKey,
                onSelect,
            }}
        >
            <DropdownMenuContextProvider value={menuControl}>
                <LazyMotion features={domAnimation}>
                    <AnimatePresence exitBeforeEnter>
                        {!hidden && (
                            <m.ul
                                id={menuId}
                                ref={menuRef}
                                initial={initialStyle}
                                animate={enterStyle}
                                exit={exitStyle}
                                transition={{ duration: 0.15, type: 'tween' }}
                                className={menuClass}
                                {...rest}
                            >
                                {children}
                            </m.ul>
                        )}
                    </AnimatePresence>
                </LazyMotion>
            </DropdownMenuContextProvider>
        </MenuContextProvider>
    )
})

export default Menu
