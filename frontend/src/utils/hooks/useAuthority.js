import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(userAuthority = [], authority = [], emptyCheck = false) {
    const roleMatched = useMemo(() => {
        return authority.some((role) => userAuthority.includes(role))
    }, [authority, userAuthority])

    if (typeof authority === 'undefined' || isEmpty(authority)) {
        return !emptyCheck
    }

    if (isEmpty(userAuthority)) {
        return false
    }

    return roleMatched
}

export default useAuthority
