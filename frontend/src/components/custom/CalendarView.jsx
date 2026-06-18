import React from 'react'
import classNames from 'classnames'
import { Badge } from 'components/ui'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from "@fullcalendar/core/locales/es"
import { eventColors } from './eventColors'

const CalendarView = (props) => {
    
    const { wrapperClass, ...rest } = props
    return (
        <div className={classNames('calendar', wrapperClass)} >
            <FullCalendar
                showNonCurrentDates={false}
                locale={esLocale}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ left: 'title', center: '', right: 'prev,next today' }}
                eventContent={ arg => {
                    const { extendedProps } = arg.event
                    const { isEnd, isStart } = arg
                    return (
                        <div
                            className={classNames(
                                'custom-calendar-event',
                                extendedProps.eventColor
                                    ? eventColors[extendedProps.eventColor]?.bg
                                    : '',
                                extendedProps.eventColor
                                    ? eventColors[extendedProps.eventColor]
                                          ?.text
                                    : '',
                                isEnd &&
                                    !isStart &&
                                    '!rounded-tl-none !rounded-bl-none !rtl:rounded-tr-none !rtl:rounded-br-none',
                                !isEnd &&
                                    isStart &&
                                    '!rounded-tr-none !rounded-br-none !rtl:rounded-tl-none !rtl:rounded-bl-none'
                            )}
                        >
                            {!(isEnd && !isStart) && (
                                <Badge
                                    className={classNames(
                                        'mr-1 rtl:ml-1',
                                        extendedProps.eventColor
                                            ? eventColors[
                                                  extendedProps.eventColor
                                              ].dot
                                            : ''
                                    )}
                                />
                            )}
                            {!(isEnd && !isStart) && (
                                <span>{arg.timeText}</span>
                            )}
                            <span className="font-semibold ml-1 rtl:mr-1">
                                {/* {arg.event.title} */}
                            </span>
                        </div>
                    )
                }}
                dayHeaderContent={ headerInfo => {
                    const isWeekend = headerInfo.date.getUTCDay() === 0 || headerInfo.date.getUTCDay() === 6
                    // const text = headerInfo.text.charAt(0).toUpperCase() + headerInfo.text.slice(1).toLowerCase()
                    const text = headerInfo.text.toUpperCase()
                    return isWeekend ?
                    <span className='font-extrabold'>{text}</span> :
                    <span style={{ fontWeight: 'normal' }}>{text}</span>
                }}
                dayHeaderDidMount={ arg => {
                    const isWeekend = arg.date.getUTCDay() === 0 || arg.date.getUTCDay() === 6
                    if (isWeekend) {
                      arg.el.style.backgroundColor = ''
                    }
                }}
                eventDidMount={ info => {
                    const { view } = info

                    if (view.type === "dayGridMonth") {
                        const bgColor = "#e0f2fe"
                        info.el.style.backgroundColor = bgColor
                        const cell = info.el.parentElement.parentElement.parentElement.parentElement
                        cell.style.backgroundColor = bgColor
                    }
                }}
                {...rest}
            />
        </div>
    )
}

export default CalendarView
