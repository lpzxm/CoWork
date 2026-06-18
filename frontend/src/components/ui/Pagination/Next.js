import React from 'react'
import classNames from 'classnames'
import { HiChevronRight } from 'react-icons/hi'

const Next = (props) => {
    const { currentPage, pageCount, pagerClass, onNext } = props

    const disabled = currentPage === pageCount || pageCount === 0

    const onNextClick = (e) => {
        e.preventDefault()
        if (disabled) {
            return
        }
        onNext(e)
    }

    const onNextKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onNextClick(e)
        }
    }

    const pagerNextClass = classNames(
        pagerClass.default,
        'pagination-pager-next',
        disabled ? pagerClass.disabled : pagerClass.inactive
    )

    return (
        <button
            type="button"
            className={pagerNextClass}
            onClick={onNextClick}
            onKeyDown={onNextKeyDown}
            disabled={disabled}
            aria-label="Next page"
        >
            <HiChevronRight />
        </button>
    )
}

export default Next
