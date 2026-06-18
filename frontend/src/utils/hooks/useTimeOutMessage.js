import { useEffect, useState } from 'react'

function useTimeOutMessage(interval = 3000) {
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!message) {
            return undefined
        }

        const timeoutId = setTimeout(() => setMessage(''), interval)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [message, interval])

    return [message, setMessage]
}

export default useTimeOutMessage
