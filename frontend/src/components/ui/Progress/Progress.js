import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Line from './Line'
import Circle from './Circle'
import { useConfig } from '../ConfigProvider'
import { SIZES, DIRECTIONS } from '../utils/constant'

const Progress = React.forwardRef((props, ref) => {
    const { variant, color, percent, showInfo, customInfo, className, width } =
        props

    const { themeColor, primaryColorLevel } = useConfig()

    const progressInfo = showInfo ? (
        <span className={`progress-info ${variant}`}>
            {customInfo || `${percent}%`}
        </span>
    ) : null

    const strokeColor = color || `${themeColor}-${primaryColorLevel}`

    const progressTrailColor = 'gray-100'

    const progressClass = classNames(
        'progress',
        className,
        variant === 'circle' ? 'circle' : 'line'
    )

    let progressContent = null

    if (variant === 'line') {
        progressContent = (
            <Line
                strokeColor={strokeColor}
                trailColor={progressTrailColor}
                {...props}
            >
                {progressInfo}
            </Line>
        )
    } else if (variant === 'circle') {
        progressContent = (
            <Circle
                strokeColor={strokeColor}
                trailColor={progressTrailColor}
                width={width}
                {...props}
            >
                {progressInfo}
            </Circle>
        )
    }

    return (
        <div ref={ref} className={progressClass}>
            {progressContent}
        </div>
    )
})

Progress.propTypes = {
    color: PropTypes.string,
    customInfo: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    gapDegree: PropTypes.number,
    gapPosition: PropTypes.oneOf([
        DIRECTIONS.TOP,
        DIRECTIONS.RIGHT,
        DIRECTIONS.BOTTOM,
        DIRECTIONS.LEFT,
    ]),
    percent: PropTypes.number,
    showInfo: PropTypes.bool,
    size: PropTypes.oneOf([SIZES.SM, SIZES.MD]),
    strokeLinecap: PropTypes.oneOf(['round', 'square']),
    strokeWidth: PropTypes.number,
    variant: PropTypes.oneOf(['line', 'circle']),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Progress.defaultProps = {
    variant: 'line',
    percent: 0,
    showInfo: true,
    size: SIZES.MD,
    strokeLinecap: 'round',
    strokeWidth: 6,
    width: 120,
    gapDegree: 0,
    gapPosition: DIRECTIONS.TOP,
}

export default Progress
