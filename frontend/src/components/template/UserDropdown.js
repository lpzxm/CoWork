import React, { useMemo } from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import { themeConfig } from 'configs/theme.config'
import ModeSwitcher from 'components/template/ThemeConfigurator/ModeSwitcher'



const { textThemeColor } = themeConfig;

export const UserDropdown = ({ className }) => {

	const {
        employee = {},
        functionalPosition = {},
        organizationalUnit = {},
    } = useSelector((state) => state.auth || {});

    const { signOut } = useAuth();
    const ava = employee?.photo ? employee.photo : '/img/avatars/nopic.jpg';
    const employeeName = [employee?.name, employee?.lastname].filter(Boolean).join(' ') || 'Usuario';
    const functionalPositionName = functionalPosition?.name || '-';
    const organizationalUnitName = organizationalUnit?.name || organizationalUnit?.nombre || '-';

    const userAvatar = useMemo(() => (
		<div className={classNames(className, 'flex items-center gap-2')}>
			<div className="hidden md:block text-right">
				<div>
					<span className={`font-bold ${textThemeColor}`}>{employeeName}</span>
				</div>
				<div className="text-sm">
					<span>{`${functionalPositionName} `}</span>
					-
					<span>{` ${organizationalUnitName}`}</span>

				</div>
			</div>
			<Avatar size={50} src={ava} shape="circle" icon={<HiOutlineUser />} />
		</div>
	), [ava, className, employeeName, functionalPositionName, organizationalUnitName])

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={userAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="flex items-center justify-center">
                        <ModeSwitcher />
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    onClick={signOut}
                    eventKey="Sign Out"
                    className="gap-2"
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Salir</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default withHeaderItem(UserDropdown)
