import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'components/ui'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
// import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import VerticalCollapsedMenuItemCustom from './VerticalCollapsedMenuItemCustom'
import { themeConfig } from 'configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import useMenuActive from 'utils/hooks/useMenuActive'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const { MenuGroup } = Menu

const VerticalMenuContent = (props) => {
    const {
        navMode = themeConfig.navMode,
        collapsed,
        routeKey,
        navigationTree = [],
        userAuthority = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props

    const { t } = useTranslation()

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    const defaultExpandedKeys = useMemo(
        () => (activedRoute?.parentKey ? [activedRoute.parentKey] : []),
        [activedRoute?.parentKey]
    )

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const getNavItem = (nav) => {
        const subMenu = Array.isArray(nav?.subMenu) ? nav.subMenu : []

        if (subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <VerticalSingleMenuItem
                    key={nav.key}
                    nav={nav}
                    onLinkClick={handleLinkClick}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                />
            )
        }

        if (subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            return (
                <VerticalCollapsedMenuItemCustom
                    key={nav.key}
                    nav={nav}
                    onLinkClick={onMenuItemClick}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (subMenu.length > 0) {
                return (
                    <MenuGroup
                        key={nav.key}
                        label={t(nav.translateKey) || nav.title}
                    >
                        {subMenu.map((subNav) =>
                            (Array.isArray(subNav?.subMenu) ? subNav.subMenu.length : 0) > 0 ? (
                                <VerticalCollapsedMenuItemCustom
                                    key={subNav.key}
                                    nav={subNav}
                                    onLinkClick={onMenuItemClick}
                                    sideCollapsed={collapsed}
                                    userAuthority={userAuthority}
                                    direction={direction}
                                />
                            ) : (
                                <VerticalSingleMenuItem
                                    key={subNav.key}
                                    nav={subNav}
                                    onLinkClick={onMenuItemClick}
                                    sideCollapsed={collapsed}
                                    userAuthority={userAuthority}
                                    direction={direction}
                                />
                            )
                        )}
                    </MenuGroup>
                )
            } else {
                <MenuGroup label={nav.title} />
            }
        }
    }

    const fp = useSelector((state) => state.auth?.functionalPosition?.id ?? '')

    return (
        <Menu
            key={`${collapsed}-${activedRoute?.parentKey || ''}`}
            className="px-4 pb-4 text-[color:var(--c-body)]"
            variant={navMode}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaultExpandedKeys}
        >
            {navigationTree.map((nav) => {
                    const pos = nav.pos;
                    if(pos && Object.values(pos).includes(fp)) {
                        return getNavItem(nav)
                    } else if(!pos)
                    {
                        return getNavItem(nav)
                    }
                    return null
                })}
        </Menu>
    )
}

VerticalMenuContent.propTypes = {
    navMode: PropTypes.oneOf(['light', 'dark', 'themed', 'transparent']),
    collapsed: PropTypes.bool,
    routeKey: PropTypes.string,
    navigationTree: PropTypes.array,
    userAuthority: PropTypes.array,
    direction: PropTypes.oneOf(['rtl', 'ltr']),
}

export default VerticalMenuContent
