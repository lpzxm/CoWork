import React from 'react'
import classNames from 'classnames'
import { ScrollBar } from 'components/ui'
import { Button } from 'components/custom'
import PropTypes from 'prop-types'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from 'constants/theme.constant'
import Logo from 'components/template/Logo'
import navigationConfig from 'configs/navigation.config'
import appConfig from 'configs/app.config'
import VerticalMenuContent from 'components/template/VerticalMenuContent'
import useResponsive from 'utils/hooks/useResponsive'
import { useSelector } from 'react-redux'

import { FaInstagram, FaFacebook } from 'react-icons/fa'
import { RiTwitterXFill } from 'react-icons/ri'
import { TbWorldWww } from 'react-icons/tb'
import { ActionLink } from 'components/shared'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = () => {
    const navMode = useSelector((state) => state.theme.navMode)
    const mode = useSelector((state) => state.theme.mode)
    const direction = useSelector((state) => state.theme.direction)
    const currentRouteKey = useSelector(
        (state) => state.base.common.currentRouteKey
    )
    const sideNavCollapse = useSelector(
        (state) => state.theme.layout.sideNavCollapse
    )
    const userPermissions = useSelector((state) => state.auth.user.permissions)

    const { larger } = useResponsive()
    
    const sideNavColor = () => {
      switch (navMode) {
        case NAV_MODE_THEMED:      return 'side-nav-themed';
        case NAV_MODE_DARK:        return 'side-nav-dark';
        case NAV_MODE_TRANSPARENT: return 'side-nav-transparent';
        default:                   return 'side-nav-default';
      }
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED)       return NAV_MODE_DARK
        if (navMode === NAV_MODE_TRANSPARENT)  return mode
        return navMode
    }

    const menuContent = (
        <div className='flex flex-col justify-between h-5/6'>
            <VerticalMenuContent
                navMode={navMode}
                collapsed={sideNavCollapse}
                navigationTree={navigationConfig}
                routeKey={currentRouteKey}
                userAuthority={userPermissions}
                direction={direction}
            />
            <div className={`flex ${ sideNavCollapse ? 'flex-col items-center mb-12' : ''} justify-center gap-2`}>
                <ActionLink href={`https://www.facebook.com/DGEHMSV`} target='_blank'>
                    <Button twColor='white-500' variant='solid' size="lg" icon={<FaFacebook />} />
                </ActionLink>
                <ActionLink href={`https://www.instagram.com/dgehm_sv/`} target='_blank'>
                    <Button twColor='white-500' variant='solid' size="lg" icon={<FaInstagram />} />
                </ActionLink>
                <ActionLink href={`https://twitter.com/DGEHMSV`} target='_blank'>
                    <Button twColor='white-500' variant='solid' size="lg" icon={<RiTwitterXFill />} />
                </ActionLink>
                <ActionLink href={`https://www.dgehm.gob.sv`} target='_blank'>
                    <Button twColor='white-500' variant='solid' size="lg" icon={<TbWorldWww />} />
                </ActionLink>
            </div>
        </div>
    )

    return (
        <>
            {larger.md && (
                <div
                    style={
                        sideNavCollapse ? sideNavCollapseStyle : sideNavStyle
                    }
                    className={classNames(
                        'side-nav',
                        sideNavColor(),
                        !sideNavCollapse && 'side-nav-expand',
                        'overflow-hidden' // Agregado para eliminar espacio en blanco en pantallas pequenias
                    )}
                >
                    <div className="side-nav-header">
                        <Logo
                            className='flex justify-center mt-5 mb-5'
                            imgClass={sideNavCollapse ? 'w-8/12' : 'w-10/12 my-5'}
                            mode={logoMode()}
                            type={sideNavCollapse ? 'streamline' : 'full'}
                            gutter={
                                sideNavCollapse
                                    ? SIDE_NAV_CONTENT_GUTTER
                                    : LOGO_X_GUTTER
                            }
                            src={sideNavCollapse ? appConfig.escudoSrc : appConfig.logoSrc}
                        />
                    </div>
                    {sideNavCollapse ? (
                        menuContent
                    ) : (
                        <div className="side-nav-content">
                            <ScrollBar autoHide direction={direction}>
                                {menuContent}
                            </ScrollBar>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

SideNav.propTypes = {
    themed: PropTypes.bool,
    darkMode: PropTypes.bool,
    themeColor: PropTypes.string,
}

export default SideNav