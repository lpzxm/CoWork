import React, { useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ApexChart from 'react-apexcharts'
import {
    apexLineChartDefaultOption,
    apexBarChartDefaultOption,
    apexAreaChartDefaultOption,
    apexDonutChartDefaultOption,
} from 'configs/chart.config'
import { DIR_RTL } from 'constants/theme.constant'

const notDonut = ['line', 'bar', 'area']

const Chart = (props) => {
    const {
        series,
        width,
        height,
        xAxis,
        customOptions,
        type,
        direction,
        donutTitle,
        donutText,
        className,
        ...rest
    } = props

    const chartRef = useRef()

    const chartDefaultOption = useMemo(() => {
        switch (type) {
            case 'line':
                return apexLineChartDefaultOption
            case 'bar':
                return apexBarChartDefaultOption
            case 'area':
                return apexAreaChartDefaultOption
            case 'donut':
                return apexDonutChartDefaultOption
            default:
                return apexLineChartDefaultOption
        }
    }, [type])

    const isMobile =
        typeof window !== 'undefined' ? window.innerWidth < 768 : false

    const applyLegendOffset = useCallback(() => {
        if (!chartRef.current || !notDonut.includes(type)) {
            return
        }

        const legend = chartRef.current.querySelector('div.apexcharts-legend')

        if (!legend) {
            return
        }

        if (direction === DIR_RTL) {
            legend.style.right = 'auto'
            legend.style.left = '0'
        }

        if (isMobile) {
            legend.style.position = 'relative'
            legend.style.top = 0
            legend.style.justifyContent = 'start'
            legend.style.padding = 0
        }
    }, [direction, isMobile, type])

    const options = useMemo(() => {
        let nextOptions = JSON.parse(JSON.stringify(chartDefaultOption))

        if (notDonut.includes(type)) {
            nextOptions.xaxis.categories = xAxis
        }

        if (customOptions) {
            nextOptions = { ...nextOptions, ...customOptions }
        }

        const chartOptions = nextOptions.chart || {}
        const chartEvents = chartOptions.events || {}

        nextOptions.chart = {
            ...chartOptions,
            events: {
                ...chartEvents,
                mounted: (...args) => {
                    chartEvents.mounted?.(...args)
                    applyLegendOffset()
                },
                updated: (...args) => {
                    chartEvents.updated?.(...args)
                    applyLegendOffset()
                },
            },
        }

        if (type === 'donut') {
            if (donutTitle) {
                nextOptions.plotOptions.pie.donut.labels.total.label =
                    donutTitle
            }
            if (donutText) {
                nextOptions.plotOptions.pie.donut.labels.total.formatter =
                    () => donutText
            }
        }

        return nextOptions
    }, [
        applyLegendOffset,
        chartDefaultOption,
        customOptions,
        donutText,
        donutTitle,
        type,
        xAxis,
    ])

    return (
        <div
            style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
            className="chartRef"
            ref={chartRef}
        >
            <ApexChart
                options={options}
                type={type}
                series={series}
                width={width}
                height={height}
                className={className}
                {...rest}
            />
        </div>
    )
}

Chart.propTypes = {
    customOptions: PropTypes.object,
    donutTitle: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    series: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['line', 'bar', 'area', 'donut']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xAxis: PropTypes.array,
}

Chart.defaultProps = {
    series: [],
    height: 300,
    width: '100%',
    type: 'line',
}

export default Chart
