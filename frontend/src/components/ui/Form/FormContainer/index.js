import React from 'react'
import PropTypes from 'prop-types'
import { FormContextProvider, FormContextConsumer } from '../context'
import { useConfig } from '../../ConfigProvider'
import { SIZES, LAYOUT } from '../../utils/constant'
import classNames from 'classnames'

const FormContainer = ({
    children,
    labelWidth = 100,
    layout = LAYOUT.VERTICAL,
    size = SIZES.MD,
    className
}) => {
    const { controlSize } = useConfig()

    const contextValue = {
        labelWidth,
        layout,
        size: size || controlSize,
    }

    return (
        <FormContextProvider value={contextValue}>
            <FormContextConsumer>
                {(context) => {
                    return (
                        <div
                            className={classNames(
                                'form-container',
                                context.layout,
                                className
                            )}
                        >
                            {children}
                        </div>
                    )
                }}
            </FormContextConsumer>
        </FormContextProvider>
    )
}

FormContainer.propTypes = {
    layout: PropTypes.oneOf([
        LAYOUT.HORIZONTAL,
        LAYOUT.VERTICAL,
        LAYOUT.INLINE,
    ]),
    size: PropTypes.oneOf([SIZES.LG, SIZES.SM, SIZES.MD]),
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default FormContainer
