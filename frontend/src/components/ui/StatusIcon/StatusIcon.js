import React from 'react'
import PropTypes from 'prop-types'
import {
    HiCheckCircle,
    HiInformationCircle,
    HiExclamation,
    HiXCircle,
} from 'react-icons/hi'

const ICONS = {
    success: {
        color: 'text-emerald-400',
        icon: <HiCheckCircle />,
    },
    info: {
        color: 'text-blue-400',
        icon: <HiInformationCircle />,
    },
    warning: {
        color: 'text-yellow-400',
        icon: <HiExclamation />,
    },
    danger: {
        color: 'text-red-400',
        icon: <HiXCircle />,
    },
}

const StatusIcon = ({ type = 'info', custom, iconColor }) => {

    const icon = ICONS[type]

    return (
        <span className={`text-2xl ${iconColor || icon.color}`}>
            {custom || icon.icon}
        </span>
    )
}

StatusIcon.propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
    custom: PropTypes.node,
}

export default StatusIcon
