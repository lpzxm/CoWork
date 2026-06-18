import React, { useMemo, useCallback } from 'react'
import Pager from './Pagers'
import Prev from './Prev'
import Next from './Next'
import Total from './Total'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useConfig } from '../ConfigProvider'

const Pagination = ({
    className,
    currentPage = 1,
    displayTotal = false,
    onChange,
    pageSize = 1,
    total = 5
}) => {

    const { themeColor, primaryColorLevel } = useConfig()

    const pageCount = useMemo(() => {
        if (typeof total === 'number') {
            return Math.ceil(total / pageSize)
        }
        return null
    }, [total, pageSize])

    const getValidCurrentPage = useCallback(
        (count) => {
            const value = parseInt(count, 10)
            let resetValue
            if (!pageCount) {
                if (isNaN(value) || value < 1) {
                    resetValue = 1
                }
            } else {
                if (value < 1) {
                    resetValue = 1
                }
                if (value > pageCount) {
                    resetValue = pageCount
                }
            }

            if (
                (resetValue === undefined && isNaN(value)) ||
                resetValue === 0
            ) {
                resetValue = 1
            }

            return resetValue === undefined ? value : resetValue
        },
        [pageCount]
    )

    const internalCurrentPage = getValidCurrentPage(currentPage || 1)

    const onPaginationChange = (val) => {
        onChange?.(getValidCurrentPage(val))
    }

    const onPrev = useCallback(() => {
        const newPage = internalCurrentPage - 1
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const onNext = useCallback(() => {
        const newPage = internalCurrentPage + 1
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const pagerClass = {
        default: 'pagination-pager',
        inactive: 'pagination-pager-inactive',
        active: `text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 hover:bg-${themeColor}-50 dark:bg-${themeColor}-${primaryColorLevel} dark:text-gray-100`,
        disabled: 'pagination-pager-disabled',
    }

    const paginationClass = classNames('pagination', className)
    const totalContent = displayTotal ? <Total total={total} /> : null

    return (
        <div className={paginationClass}>
            {totalContent}
            <Prev
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onPrev={onPrev}
            />
            <Pager
                onChange={onPaginationChange}
                pageCount={pageCount}
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
            />
            <Next
                currentPage={internalCurrentPage}
                pageCount={pageCount}
                pagerClass={pagerClass}
                onNext={onNext}
            />
        </div>
    )
}

Pagination.propTypes = {
    total: PropTypes.number,
    displayTotal: PropTypes.bool,
    pageSize: PropTypes.number,
    className: PropTypes.string,
    currentPage: PropTypes.number,
    onChange: PropTypes.func,
}

export default Pagination
