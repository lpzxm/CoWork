import React, { useState, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import {
    HiOutlineChevronDoubleLeft,
    HiOutlineDotsHorizontal,
    HiChevronDoubleRight,
} from 'react-icons/hi'

const PAGER_COUNT = 7

const NextMore = ({ className, onArrow }) => {
    const [quickNextArrowIcon, setQuickNextArrowIcon] = useState(false)

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onArrow('nextMore')
        }
    }

    return (
        <li>
            <button
                type="button"
                className={className}
                onMouseEnter={() => {
                    setQuickNextArrowIcon(true)
                }}
                onMouseLeave={() => {
                    setQuickNextArrowIcon(false)
                }}
                onClick={() => onArrow('nextMore')}
                onKeyDown={handleKeyDown}
                aria-label="Jump forward pages"
            >
                {quickNextArrowIcon ? (
                    <HiChevronDoubleRight />
                ) : (
                    <HiOutlineDotsHorizontal />
                )}
            </button>
        </li>
    )
}

const PrevMore = ({ className, onArrow }) => {
    const [quickPrevArrowIcon, setQuickPrevArrowIcon] = useState(false)

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onArrow('prevMore')
        }
    }

    return (
        <li>
            <button
                type="button"
                className={className}
                onMouseEnter={() => {
                    setQuickPrevArrowIcon(true)
                }}
                onMouseLeave={() => {
                    setQuickPrevArrowIcon(false)
                }}
                onClick={() => onArrow('prevMore')}
                onKeyDown={handleKeyDown}
                aria-label="Jump backward pages"
            >
                {quickPrevArrowIcon ? (
                    <HiOutlineChevronDoubleLeft />
                ) : (
                    <HiOutlineDotsHorizontal />
                )}
            </button>
        </li>
    )
}

const Pagers = (props) => {
    const { pageCount, currentPage, onChange, pagerClass } = props

    const { showPrevMore, showNextMore } = useMemo(() => {
        let nextShowPrevMore = false
        let nextShowNextMore = false

        if (pageCount > PAGER_COUNT) {
            if (currentPage > PAGER_COUNT - 2) {
                nextShowPrevMore = true
            }
            if (currentPage < pageCount - 2) {
                nextShowNextMore = true
            }
            if (currentPage >= pageCount - 3 && currentPage <= pageCount) {
                nextShowNextMore = false
            }
            if (currentPage >= 1 && currentPage <= 4) {
                nextShowPrevMore = false
            }
        }

        return {
            showPrevMore: nextShowPrevMore,
            showNextMore: nextShowNextMore,
        }
    }, [currentPage, pageCount])

    const onPagerClick = (value, e) => {
        e.preventDefault()
        let newPage = value

        if (newPage < 1) {
            newPage = 1
        }
        if (newPage > pageCount) {
            newPage = pageCount
        }

        if (newPage !== currentPage) {
            onChange(newPage)
        }
    }

    const onArrowClick = useCallback(
        (e) => {
            let newPage = currentPage
            if (e === 'nextMore') {
                newPage = currentPage + 5
            }
            if (e === 'prevMore') {
                newPage = currentPage - 5
            }
            onChange(newPage)
        },
        [currentPage, onChange]
    )

    const getPages = useMemo(() => {
        const pagerArray = []
        if (showPrevMore && !showNextMore) {
            const startPage = pageCount - (PAGER_COUNT - 2)
            for (let i = startPage; i < pageCount; i++) {
                pagerArray.push(i)
            }
        } else if (!showPrevMore && showNextMore) {
            for (let i = 2; i < PAGER_COUNT; i++) {
                pagerArray.push(i)
            }
        } else if (showPrevMore && showNextMore) {
            const offset = Math.floor(PAGER_COUNT / 2) - 1
            const maxRange =
                currentPage >= pageCount - 2 && currentPage <= pageCount
            for (
                let i = currentPage - offset;
                i <= currentPage + (maxRange ? 0 : offset);
                i++
            ) {
                pagerArray.push(i)
            }
        } else {
            for (let i = 2; i < pageCount; i++) {
                pagerArray.push(i)
            }
        }
        if (pagerArray.length > PAGER_COUNT - 2) {
            return []
        }

        return pagerArray
    }, [showPrevMore, showNextMore, currentPage, pageCount])

    const getPagerClass = (index) => {
        return classNames(
            pagerClass.default,
            currentPage === index ? pagerClass.active : pagerClass.inactive
        )
    }

    const handlePagerKeyDown = (event, value) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onPagerClick(value, event)
        }
    }

    return (
        <ul>
            {pageCount > 0 && (
                <li>
                    <button
                        type="button"
                        className={getPagerClass(1)}
                        onClick={(e) => onPagerClick(1, e)}
                        onKeyDown={(e) => handlePagerKeyDown(e, 1)}
                        aria-label="Go to page 1"
                    >
                        1
                    </button>
                </li>
            )}
            {showPrevMore && (
                <PrevMore
                    onArrow={(arrow) => onArrowClick(arrow)}
                    className={classNames(
                        pagerClass.default,
                        pagerClass.inactive
                    )}
                />
            )}
            {getPages.map((pager) => {
                return (
                    <li key={pager}>
                        <button
                            type="button"
                            className={getPagerClass(pager)}
                            onClick={(e) => onPagerClick(pager, e)}
                            onKeyDown={(e) => handlePagerKeyDown(e, pager)}
                            aria-label={`Go to page ${pager}`}
                        >
                            {pager}
                        </button>
                    </li>
                )
            })}
            {showNextMore && (
                <NextMore
                    onArrow={(arrow) => onArrowClick(arrow)}
                    className={classNames(
                        pagerClass.default,
                        pagerClass.inactive
                    )}
                />
            )}
            {pageCount > 1 && (
                <li>
                    <button
                        type="button"
                        className={getPagerClass(pageCount)}
                        onClick={(e) => onPagerClick(pageCount, e)}
                        onKeyDown={(e) => handlePagerKeyDown(e, pageCount)}
                        aria-label={`Go to page ${pageCount}`}
                    >
                        {pageCount}
                    </button>
                </li>
            )}
        </ul>
    )
}

export default Pagers
