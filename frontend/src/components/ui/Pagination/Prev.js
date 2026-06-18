import React from 'react'
import classNames from 'classnames'
import { HiChevronLeft } from 'react-icons/hi'

const Prev = (props) => {
    const { currentPage, pagerClass, onPrev } = props

    const disabled = currentPage <= 1

    const onPrevClick = (e) => {
        e.preventDefault()
        if (disabled) {
            return
        }
        onPrev(e)
    }

    const onPrevKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onPrevClick(e)
        }
    }

    const pagerPrevClass = classNames(
        pagerClass.default,
        'pagination-pager-prev',
        disabled ? pagerClass.disabled : pagerClass.inactive
    )

    return (
        <button
            type="button"
            className={pagerPrevClass}
            onClick={onPrevClick}
            onKeyDown={onPrevKeyDown}
            disabled={disabled}
            aria-label="Previous page"
        >
            <HiChevronLeft />
        </button>
    )
}

export default Prev
