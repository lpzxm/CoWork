import React, { useEffect, useCallback,useState } from 'react'
import { setLayout, setPreviousLayout } from 'store/theme/themeSlice'
import { setCurrentGeneralKey,setCurrentRouteKey,setCurrentRouteTitle,setCurrentRouteSubtitle,setCurrentRouteInfo,setCurrentRouteOptions,setCurrentRouteSubOptions,setCurrentRouteIndex,setCurrentRouteSubIndex } from 'store/base/commonSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation,Link } from 'react-router-dom'
import { Segment } from 'components/ui'
import classNames from 'classnames'

import { HiCheckCircle } from 'react-icons/hi'

const OptionsMenu = ({options,index,functionalPosition}) =>
{
    const [value, setValue] = useState([String(index)])
    const selectOptionSegment = val => { setValue(val) }

    const { employee } = useSelector( state => state.auth )

    const isRRHH = functionalPosition.id === 48 || functionalPosition.id === 89 || functionalPosition.id === 115 ? true : false;
    const isBoss = functionalPosition.boss === 1 ? true : false;
    return (
        <>
            <Segment
                className={`flex flex-col gap-1`}
                value = { value }
                onChange = { selectOptionSegment }
            >
            {
                options.map( ( opt, i ) => {
                    if(((opt.boss) && (isBoss)) || ((opt.rrhh) && (isRRHH)) || (!opt.rrhh && !opt.boss))
                    {
                        if ( !opt.pos || (opt.pos && opt.pos.length > 0 && opt.pos.includes(employee.id)) ) {
                            return (
                                <Segment.Item key={`segment-item-`+i} value={String(i+1)}>
                                {({  active, value, onSegmentItemClick, disabled }) => {
                                    return (
                                        <Link
                                            className="block"
                                            onClick={onSegmentItemClick}
                                            to={opt.path}
                                        >
                                            <div
                                                className={classNames(
                                                    'flex',
                                                    'ring-1',
                                                    'justify-between',
                                                    'items-center',
                                                    'font-semibold',
                                                    'border',
                                                    'rounded-md ',
                                                    'border-gray-300',
                                                    'py-3 px-4',
                                                    'cursor-pointer',
                                                    'select-none',
                                                    'w-100',
                                                    active
                                                        ? 'ring-buke-600 border-buke-600 bg-buke-200 text-slate-800'
                                                        : 'ring-transparent',
                                                    disabled
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'hover:ring-buke-600 hover:border-buke-600'
                                                )}
                                            >
                                                {opt.title}
                                                {active && (
                                                    <HiCheckCircle className="text-buke-600 text-xl" />
                                                )}
                                            </div>
                                        </Link>
                                    )
                                }}
                                </Segment.Item>
                            )
                        }
                    }
                    return ''
                })
            }
            </Segment>
        </>
    )
}

const SubOptionsMenu = ({options,index,functionalPosition}) =>
{
    const [value, setValue] = useState([String(index)])
    const selectSubOptionSegment = val => { setValue(val) }

    return (
        <>
            <div className='border-b py-4 '>
                <Segment
                    className = { `
                        gap-3
                        flex flex-row
                        justify-center
                    `}
                    value={value} 
                    onChange={selectSubOptionSegment}>
                {
                    options.map((opt,i)=> (
                        <Segment.Item key={`segment-item-`+i} value={String(i+1)}>
                        {({ ref, active, value, onSegmentItemClick, disabled }) => {
                            return (
                                <Link
                                    className='py-0 block'
                                    onClick={onSegmentItemClick}
                                    to={opt.path}
                                >
                                    <div
                                        ref={ref}
                                        className={classNames(
                                            'flex',
                                            'ring-1',
                                            'justify-center',
                                            'gap-2',
                                            'border',
                                            'font-semibold',
                                            'rounded-md ',
                                            'border-gray-300',
                                            'py-2 px-1',
                                            'cursor-pointer',
                                            'select-none',
                                            'md:w-[200px]',
                                            active
                                                ? 'ring-buke-600 border-buke-600 bg-buke-100 text-slate-800'
                                                : 'ring-transparent',
                                            disabled
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:ring-buke-600 hover:border-buke-600'
                                        )}
                                    >
                                        {opt.title}
                                        {active && (
                                            <HiCheckCircle className="text-buke-600 text-xl" />
                                        )}
                                    </div>
                                </Link>
                            )
                        }}
                            
                        </Segment.Item>
                    ))
                }
                </Segment>
            </div>
        </>
    )
}

const AppRoute = ({ component: Component, routeKey,generalKey, index, subIndex, base, ...props }) => {
    
    const location = useLocation()

    const dispatch = useDispatch()

    const layoutType = useSelector((state) => state.theme.layout.type)
    const previousLayout = useSelector( (state) => state.theme.layout.previousType )
    const { functionalPosition } = useSelector((state) => state.auth)

    const handleLayoutChange = useCallback(() => {
        dispatch(setCurrentGeneralKey(generalKey))
        dispatch(setCurrentRouteKey(routeKey))
        dispatch(setCurrentRouteIndex(index))
        dispatch(setCurrentRouteSubIndex(subIndex))
        
        if(base)
        {
            dispatch(setCurrentRouteTitle(base.title))
            dispatch(setCurrentRouteSubtitle(base.subtitle))
            dispatch(setCurrentRouteInfo(base.info))
            dispatch(setCurrentRouteOptions(base.options))
            dispatch(setCurrentRouteSubOptions(base.subOptions))
        }

        if (props.layout && props.layout !== layoutType) {
            dispatch(setPreviousLayout(layoutType))
            dispatch(setLayout(props.layout))
        }

        if (!props.layout && previousLayout && layoutType !== previousLayout) {
            dispatch(setLayout(previousLayout))
            dispatch(setPreviousLayout(''))
        }
    }, [dispatch, layoutType,index,subIndex, previousLayout, props.layout, routeKey,base,generalKey])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    const titleBase = (base) =>
    {
        let border = ''
        let padding = null
        if(base && base.subOptions && base.subOptions.length === 0 )
        {
            border =  'border-b'
            padding =  'pb-6'
        }

        return base ? (
            <div>
                <div
                    className={`
                        ${border}
                        xs:flex xs:flex-col xs:justify-between xs:items-center xs:gap-5
                        md:flex md:flex-row md:justify-between md:items-top`}
                >
                    <div className="md:w-7/12">
                        <h2 className="mb-3">{base.title}</h2>
                        <h3 className="mb-3">{base.subtitle}</h3>
                        <p>{base.info}</p>
                    </div>
                    <div className={`xs:w-full md:w-3/12`}>
                        {base.options && base.options.length > 1 ? (
                            <OptionsMenu
                                options={base.options}
                                index={index}
                                functionalPosition={functionalPosition}
                            />
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>
                <div className={`w-full ${padding}`}>
                    {base.subOptions ? (
                        <SubOptionsMenu
                            options={base.subOptions}
                            index={subIndex}
                            functionalPosition={functionalPosition}
                        />
                    ) : (
                        <span></span>
                    )}
                </div>
                <hr className="my-6" />
            </div>
        ) : (
            <></>
        )
    }
    
    return(
        <>
            {titleBase(base)}
            <Component {...props} />
        </>
    )
}

export default AppRoute
