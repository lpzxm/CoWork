import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Menu, Dropdown } from 'components/ui'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Trans } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {

    const { employee, functionalPosition } = useSelector( state => state.auth );

    const subNavsFiltered = useMemo(
        () =>
            nav.subMenu?.filter(
                (subNav) =>
                    (!subNav.pos ||
                        (subNav.pos.length > 0 &&
                            subNav.pos.includes(functionalPosition.id))) ||
                    (subNav.emps &&
                        subNav.emps.length > 0 &&
                        subNav.emps.includes(employee.id))
            ) || [],
        [employee.id, functionalPosition.id, nav.subMenu]
    )

    const collapseLabel = useMemo(
        () => (
            <>
                <VerticalMenuIcon icon={nav.icon} />
                <span className="text-inherit">
                    <Trans
                        i18nKey={nav.translateKey}
                        defaults={nav.title}
                    />
                </span>
            </>
        ),
        [nav.icon, nav.title, nav.translateKey]
    )

    
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {/* <Link
                className="h-full w-full"
                onClick={() =>
                    onLinkClick?.({
                        key: nav.key,
                        title: nav.title,
                        path: nav.path,
                    })
                }
                to={nav.path}
            > */}
                <MenuCollapse
                    label={collapseLabel}
                    key={nav.key}
                    eventKey={nav.key}
                    expanded={false}
                    className="mb-2"
                >
                {subNavsFiltered.map((subNav) => {

                        return (<AuthorityCheck
                            userAuthority={userAuthority}
                            authority={subNav.authority}
                            key={subNav.key}
                        >
                            <MenuItem
                                eventKey={subNav.key}
                                className="menu-item"
                            >
                                {subNav.path  ? (
                                    <Link
                                        className="h-full w-full flex items-center"
                                        onClick={() =>
                                            onLinkClick?.({
                                                key: subNav.key,
                                                title: subNav.title,
                                                path: subNav.path,
                                            })
                                        }
                                        to={subNav.path}
                                    >
                                        <span>
                                            <Trans
                                                i18nKey={subNav.translateKey}
                                                defaults={subNav.title}
                                            />
                                        </span>
                                    </Link>
                                ) : (
                                    <span>
                                        <Trans
                                            i18nKey={subNav.translateKey}
                                            defaults={subNav.title}
                                        />
                                    </span>
                                )}
                            </MenuItem>
                        </AuthorityCheck>)
                }
                )}
                </MenuCollapse>
            {/* </Link> */}
        </AuthorityCheck>
    )
}

const CollapsedItem = ({ nav, onLinkClick, userAuthority, direction }) => {
    const menuItem = useMemo(
        () => (
            <MenuItem key={nav.key} eventKey={nav.key} className="mb-2 menu-item">
                <Link
                    className="h-full w-full flex items-center"
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                    to={nav.path}
                >
                    <VerticalMenuIcon icon={nav.icon} />
                </Link>
            </MenuItem>
        ),
        [nav.icon, nav.key, nav.path, nav.title, onLinkClick]
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <Dropdown
                trigger="click"
                renderTitle={menuItem}
                placement={
                    direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'
                }
            >
                {nav.subMenu.map((subNav) => (
                    <AuthorityCheck
                        userAuthority={userAuthority}
                        authority={subNav.authority}
                        key={subNav.key}
                    >
                        <Dropdown.Item eventKey={subNav.key}>
                            {subNav.path ? (
                                <Link
                                    className="h-full w-full flex items-center"
                                    onClick={() =>
                                        onLinkClick?.({
                                            key: subNav.key,
                                            title: subNav.title,
                                            path: subNav.path,
                                        })
                                    }
                                    to={subNav.path}
                                >
                                    <span>
                                        <Trans
                                            i18nKey={subNav.translateKey}
                                            defaults={subNav.title}
                                        />
                                    </span>
                                </Link>
                            ) : (
                                <span>
                                    <Trans
                                        i18nKey={subNav.translateKey}
                                        defaults={subNav.title}
                                    />
                                </span>
                            )}
                        </Dropdown.Item>
                    </AuthorityCheck>
                ))}
            </Dropdown>
        </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItemCustom = ({ sideCollapsed, ...rest }) => {
    return sideCollapsed ? <CollapsedItem {...rest} /> : <DefaultItem  {...rest} />
}

export default VerticalCollapsedMenuItemCustom
