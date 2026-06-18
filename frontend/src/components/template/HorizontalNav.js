import React from 'react'
import HorizontalMenuContent from './HorizontalMenuContent'
import useResponsive from 'utils/hooks/useResponsive'
import { useSelector } from 'react-redux'

const HorizontalNav = () => {
    const mode = useSelector((state) => state.theme.mode)
    const userPermissions = useSelector((state) => state.auth.user.permissions)

    const { larger } = useResponsive()

    return (
        <>
            {larger.md && (
                <HorizontalMenuContent
                    manuVariant={mode}
                    userAuthority={userPermissions}
                />
            )}
        </>
    )
}

export default HorizontalNav
