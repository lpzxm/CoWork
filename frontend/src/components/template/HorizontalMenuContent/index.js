import React, { useMemo } from 'react'
import navigationConfig from 'configs/navigation.config'
import { Dropdown } from 'components/ui'
import { AuthorityCheck } from 'components/shared'
import HorizontalMenuItem from './HorizontalMenuItem'
import HorizontalMenuDropdownItem from './HorizontalMenuDropdownItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import { useTranslation } from 'react-i18next'

const EMPTY_AUTHORITY = []

const HorizontalMenuCollapse = ({ manuVariant, nav, userAuthority, t }) => {
    const renderTitle = useMemo(
        () => <HorizontalMenuItem manuVariant={manuVariant} nav={nav} />,
        [manuVariant, nav]
    )

    return (
        <Dropdown trigger="hover" renderTitle={renderTitle}>
            {nav.subMenu.map((secondarySubNav) => (
                <AuthorityCheck
                    authority={secondarySubNav.authority}
                    userAuthority={userAuthority}
                    key={secondarySubNav.key}
                >
                    {secondarySubNav.subMenu.length > 0 ? (
                        <Dropdown.Menu
                            title={t(
                                secondarySubNav.translateKey,
                                secondarySubNav.title
                            )}
                        >
                            {secondarySubNav.subMenu.map((tertiarySubNav) => (
                                <AuthorityCheck
                                    authority={tertiarySubNav.authority}
                                    userAuthority={userAuthority}
                                    key={tertiarySubNav.key}
                                >
                                    <HorizontalMenuDropdownItem
                                        nav={tertiarySubNav}
                                    />
                                </AuthorityCheck>
                            ))}
                        </Dropdown.Menu>
                    ) : (
                        <HorizontalMenuDropdownItem
                            nav={secondarySubNav}
                            key={secondarySubNav.key}
                        />
                    )}
                </AuthorityCheck>
            ))}
        </Dropdown>
    )
}

const HorizontalMenuContent = ({ manuVariant, userAuthority = EMPTY_AUTHORITY }) => {
    const { t } = useTranslation()

    return (
        <span className="flex items-center">
            {navigationConfig.map((nav) => {
                if (
                    nav.type === NAV_ITEM_TYPE_TITLE ||
                    nav.type === NAV_ITEM_TYPE_COLLAPSE
                ) {
                    return (
                        <AuthorityCheck
                            authority={nav.authority}
                            userAuthority={userAuthority}
                            key={nav.key}
                        >
                            <HorizontalMenuCollapse
                                manuVariant={manuVariant}
                                nav={nav}
                                t={t}
                                userAuthority={userAuthority}
                            />
                        </AuthorityCheck>
                    )
                }
                if (nav.type === NAV_ITEM_TYPE_ITEM) {
                    return (
                        <AuthorityCheck
                            authority={nav.authority}
                            userAuthority={userAuthority}
                            key={nav.key}
                        >
                            <HorizontalMenuItem
                                isLink
                                nav={nav}
                                manuVariant={manuVariant}
                            />
                        </AuthorityCheck>
                    )
                }
                return null
            })}
        </span>
    )
}

export default HorizontalMenuContent
