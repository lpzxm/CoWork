import { useEffect, useMemo, useReducer } from 'react'
import { apiGetEmployeePhoto } from 'services/AdministrationService'

const photoCache = new Map()

const initialPhotoState = {
    src: null,
    error: null,
}

function employeePhotoReducer(state, action) {
    switch (action.type) {
        case 'reset':
            return initialPhotoState
        case 'cached':
        case 'resolved':
            return { src: action.src, error: null }
        case 'rejected':
            return { ...state, error: action.error }
        default:
            return state
    }
}

function makeKey(employeeId, params) {
    const qs = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = String(v)
            return acc
        }, {})
    ).toString()
    return `${employeeId}?${qs}`
}

export default function useEmployeePhoto(employeeId, params) {
    const paramsSignature = useMemo(
        () => JSON.stringify(params || {}),
        [params]
    )
    const stableParams = useMemo(
        () => JSON.parse(paramsSignature),
        [paramsSignature]
    )
    const key = useMemo(
        () => makeKey(employeeId, stableParams),
        [employeeId, stableParams]
    )
    const [state, dispatch] = useReducer(
        employeePhotoReducer,
        photoCache.get(key) || null,
        (cachedSrc) => ({ src: cachedSrc, error: null })
    )

    useEffect(() => {
        let cancelled = false

        if (!employeeId) {
            dispatch({ type: 'reset' })
            return
        }

        const cached = photoCache.get(key)
        if (cached) {
            dispatch({ type: 'cached', src: cached })
            return
        }

        apiGetEmployeePhoto(employeeId, stableParams)
            .then((res) => {
                const blob = res.data
                const objectUrl = URL.createObjectURL(blob)
                photoCache.set(key, objectUrl)
                if (!cancelled) {
                    dispatch({ type: 'resolved', src: objectUrl })
                }
            })
            .catch((e) => {
                console.error('photo fetch error:', e)
                if (!cancelled) {
                    dispatch({ type: 'rejected', error: e })
                }
            })

        return () => {
            cancelled = true
        }
    }, [employeeId, key, stableParams])

    return state
}