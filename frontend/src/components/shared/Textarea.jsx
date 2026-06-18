
import React from 'react'
import { Input } from 'components/ui'

const Textarea = (props) => {
    const {
        id,
        placeholder,
        value,
        ...rest
    } = props

    return (
        <div>
            <Input 
                id={id}
                placeholder={placeholder}
                value={value}
                {...rest} 
                textArea
            />
        </div>
    )
}

export default Textarea
