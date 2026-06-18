import { useState, useEffect } from 'react'

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState(() => {
        if (typeof window === 'undefined') {
            return {
                width: undefined,
                height: undefined,
            }
        }

        return {
            width: window.innerWidth,
            height: window.innerHeight,
        }
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}
