import React from 'react'
import { HiCheckCircle } from 'react-icons/hi'

const CustomSelectOption = ({innerProps, label, isSelected}) =>
{
    return (
        <div 
            className = {`flex items-center justify-between p-2 cursor-pointer ${
                isSelected
                ? 'bg-gray-100 dark:bg-gray-500' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }` } 
            {...innerProps}
        >
            <div className = "flex items-center gap-2">
                <span>{ label }</span>
            </div>
            { isSelected && <HiCheckCircle className="text-emerald-500 text-xl" /> }
        </div>
    )
}

export default CustomSelectOption



