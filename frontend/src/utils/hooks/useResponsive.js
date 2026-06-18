import { useEffect, useState } from 'react'
import { twScreens } from 'utils/tailwindTheme'

const breakpointInt = (str = '') => {
    return parseInt(String(str).replace(/[^\d]/g, ''), 10)
}

const breakpoint = {
    '2xl': breakpointInt(twScreens['2xl']),
    xl: breakpointInt(twScreens.xl),
    lg: breakpointInt(twScreens.lg),
    md: breakpointInt(twScreens.md),
    sm: breakpointInt(twScreens.sm),
    xs: breakpointInt(twScreens.xs),
}

const getAllSizes = (windowWidth, comparator = 'smaller') => {
    return Object.fromEntries(
        Object.entries(breakpoint).map(([key, value]) => [
            key,
            comparator === 'larger'
                ? windowWidth > value
                : windowWidth < value,
        ])
    )
}

const getResponsiveState = () => {
    if (typeof window === 'undefined') {
        return {
            windowWidth: 0,
            larger: getAllSizes(0, 'larger'),
            smaller: getAllSizes(0, 'smaller'),
        }
    }

    const currentWindowWidth = window.innerWidth
    return {
        windowWidth: currentWindowWidth,
        larger: getAllSizes(currentWindowWidth, 'larger'),
        smaller: getAllSizes(currentWindowWidth, 'smaller'),
    }
}

const useResponsive = () => {
    const [responsive, setResponsive] = useState(() => getResponsiveState())

    useEffect(() => {
        const syncResponsiveState = () => {
            setResponsive(getResponsiveState())
        }

        window.addEventListener('resize', syncResponsiveState)
        return () => window.removeEventListener('resize', syncResponsiveState)
    }, [])

    return responsive
}

export default useResponsive
