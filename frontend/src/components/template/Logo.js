import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { COM_NAME } from 'constants/app.constant'
import appConfig from 'configs/app.config'

const Logo = ({
    gutter,
    className,
    imgClass,
    style,
    logoWidth = 'auto',
    src = appConfig.logoSrc,
    mode = 'light',
    type = 'full'
}) => {
    return (
        <div
            className={classNames('logo', className, gutter)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={src}
                alt={`${COM_NAME} logo`}
            />
        </div>
    )
}

Logo.propTypes = {
    mode: PropTypes.oneOf(['light', 'dark']),
    type: PropTypes.oneOf(['full', 'streamline']),
    gutter: PropTypes.string,
    imgClass: PropTypes.string,
    logoWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    src: PropTypes.string
}

export default Logo