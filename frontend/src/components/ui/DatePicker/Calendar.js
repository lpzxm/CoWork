import React from 'react'
import CalendarBase from './CalendarBase'
import { isSameDate } from './utils/isSameDate'

const Calendar = (props) => {
    const { multipleSelection, value, onChange, ...rest } = props

    const selectCalendarDate = (date) => {
        if (!multipleSelection) {
            return onChange(date)
        }

        const isSelected = value.some((val) => isSameDate(val, date))

        return onChange(
            isSelected
                ? value.filter((val) => !isSameDate(val, date))
                : [...value, date]
        )
    }

    return <CalendarBase onChange={selectCalendarDate} value={value} {...rest} />
}

export default Calendar
