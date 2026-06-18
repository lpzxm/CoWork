import React, { useState, useRef, forwardRef, useMemo } from 'react'
import dayjs from 'dayjs'
import useControllableState from '../hooks/useControllableState'
import useMergedRef from '../hooks/useMergeRef'
import Calendar from './Calendar'
import BasePicker from './BasePicker'
import { useConfig } from '../ConfigProvider'
import capitalize from '../utils/capitalize'

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD'

const DatePicker = forwardRef((props, ref) => {
    const {
        className,
        clearable,
        clearButton,
        closePickerOnChange,
        dateViewCount,
        dayClassName,
        dayStyle,
        defaultMonth,
        defaultOpen,
        defaultValue,
        defaultView,
        disabled,
        disableDate,
        enableHeaderLabel,
        disableOutOfMonth,
        firstDayOfWeek,
        hideOutOfMonthDates,
        hideWeekdays,
        inputFormat,
        inputPrefix,
        inputSuffix,
        inputtable,
        labelFormat,
        locale,
        maxDate,
        minDate,
        name,
        onBlur,
        onChange,
        onFocus,
        onDropdownClose,
        onDropdownOpen,
        openPickerOnClear,
        renderDay,
        size,
        style,
        type,
        value,
        weekendDays,
        yearLabelFormat,
        ...rest
    } = props

    const { locale: themeLocale } = useConfig()

    const finalLocale = locale || themeLocale

    const dateFormat =
        type === 'date'
            ? DEFAULT_INPUT_FORMAT
            : inputFormat || DEFAULT_INPUT_FORMAT

    const [dropdownOpened, setDropdownOpened] = useState(defaultOpen)

    const inputRef = useRef()
    const [currentDate] = useState(() => new Date())

    const [lastValidValue, setLastValidValue] = useState(defaultValue ?? null)

    const [_value, setValue] = useControllableState({
        prop: value,
        defaultProp: defaultValue,
        onChange,
    })

    const [calendarMonth, setCalendarMonth] = useState(
        _value || defaultMonth || currentDate
    )

    const [focused, setFocused] = useState(false)

    const formattedValue = useMemo(
        () =>
            _value instanceof Date
                ? capitalize(dayjs(_value).locale(finalLocale).format(dateFormat))
                : '',
        [_value, finalLocale, dateFormat]
    )

    const [draftInputValue, setDraftInputValue] = useState(() => formattedValue)

    const closeDropdown = () => {
        setDropdownOpened(false)
        onDropdownClose?.()
    }

    const openDropdown = () => {
        setDropdownOpened(true)
        onDropdownOpen?.()
    }

    const handleValueChange = (date) => {
        setValue(date)
        setLastValidValue(date)
        setDraftInputValue(
            capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
        )
        setCalendarMonth(date)
        closePickerOnChange && closeDropdown()
        window.setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleClear = () => {
        setValue(null)
        setLastValidValue(null)
        setDraftInputValue('')
        openPickerOnClear && openDropdown()
        inputRef.current?.focus()
    }

    const parseDate = (date) => dayjs(date, dateFormat, finalLocale).toDate()

    const setDateFromInput = () => {
        let date = parseDate(draftInputValue)

        if (maxDate && dayjs(date).isAfter(maxDate)) {
            date = maxDate
        }

        if (minDate && dayjs(date).isBefore(minDate)) {
            date = minDate
        }

        if (dayjs(date).isValid()) {
            setValue(date)
            setLastValidValue(date)
            setDraftInputValue(
                capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
            )
            setCalendarMonth(date)
        } else {
            setValue(lastValidValue)
        }
    }

    const handleInputBlur = (event) => {
        typeof onBlur === 'function' && onBlur(event)

        if (inputtable) {
            setDateFromInput()
        }

        setFocused(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputtable) {
            closeDropdown()
            setDateFromInput()
        }
    }

    const handleInputFocus = (event) => {
        typeof onFocus === 'function' && onFocus(event)
        setDraftInputValue(formattedValue)
        setFocused(true)
    }

    const handleInputChange = (event) => {
        openDropdown()

        const nextInputValue = event.target.value
        const date = parseDate(event.target.value)
        setDraftInputValue(nextInputValue)

        if (dayjs(date).isValid()) {
            setValue(date)
            setLastValidValue(date)
            setCalendarMonth(date)
        }
    }

    return (
        <BasePicker
            inputtable={inputtable}
            dropdownOpened={dropdownOpened}
            setDropdownOpened={setDropdownOpened}
            ref={useMergedRef(ref, inputRef)}
            size={size}
            style={style}
            className={className}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            name={name}
            inputLabel={focused ? draftInputValue : formattedValue}
            clearable={
                type === 'date' ? false : clearable && !!_value && !disabled
            }
            clearButton={clearButton}
            onClear={handleClear}
            disabled={disabled}
            onDropdownClose={onDropdownClose}
            onDropdownOpen={onDropdownOpen}
            type={type}
            inputPrefix={inputPrefix}
            inputSuffix={inputSuffix}
            {...rest}
        >
            <Calendar
                locale={finalLocale}
                month={inputtable ? calendarMonth : undefined}
                defaultMonth={defaultMonth || (_value instanceof Date ? _value : currentDate)}
                onMonthChange={setCalendarMonth}
                value={
                    _value instanceof Date
                        ? _value
                        : _value && dayjs(_value).toDate()
                }
                onChange={handleValueChange}
                labelFormat={labelFormat}
                dayClassName={dayClassName}
                dayStyle={dayStyle}
                disableOutOfMonth={disableOutOfMonth}
                minDate={minDate}
                maxDate={maxDate}
                disableDate={disableDate}
                firstDayOfWeek={firstDayOfWeek}
                preventFocus={inputtable}
                dateViewCount={dateViewCount}
                enableHeaderLabel={enableHeaderLabel}
                defaultView={defaultView}
                hideOutOfMonthDates={hideOutOfMonthDates}
                hideWeekdays={hideWeekdays}
                renderDay={renderDay}
                weekendDays={weekendDays}
                yearLabelFormat={yearLabelFormat}
            />
        </BasePicker>
    )
})

DatePicker.defaultProps = {
    closePickerOnChange: true,
    labelFormat: {
        month: 'MMM',
        year: 'YYYY',
    },
    defaultOpen: false,
    name: 'date',
    clearable: true,
    disabled: false,
    firstDayOfWeek: 'monday',
    locale: 'es',
    openPickerOnClear: false,
}

export default DatePicker
