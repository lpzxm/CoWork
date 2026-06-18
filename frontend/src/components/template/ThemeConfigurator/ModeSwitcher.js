import React, { useCallback } from 'react'
import useDarkMode from 'utils/hooks/useDarkMode'
import { Button } from 'components/custom'
import { FaSun, FaMoon } from 'react-icons/fa'

const ModeSwitcher = () => {

    const [ isDark, setIsDark ] = useDarkMode()

    const onClick = useCallback(() => {
        setIsDark(!isDark ? 'dark' : 'light')
    }, [isDark, setIsDark])

    return (
        <div>
            <Button
                onClick={onClick}
                className="!p-0 !border-0 !bg-transparent"
                variant="plain"
                size="icon"
                shape="circle"
                icon = {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                color={isDark ? 'warning' : 'info'}
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </Button>
        </div>
    )
}

export default ModeSwitcher