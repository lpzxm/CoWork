import React from 'react'
import { useConfig } from '../ConfigProvider'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

const Sorter = ({ sort }) => {
    const { themeColor, primaryColorLevel } = useConfig()

    const color = `text-${themeColor}-${primaryColorLevel}`

    let sortIcon = null

    if (typeof sort === 'boolean' && !sort) {
        sortIcon = <FaSort />
    } else if (typeof sort === 'string' && sort === 'asc') {
        sortIcon = <FaSortDown className={color} />
    } else if (typeof sort === 'string' && sort === 'desc') {
        sortIcon = <FaSortUp className={color} />
    }

    return <div className="inline-flex">{sortIcon}</div>
}

export default Sorter