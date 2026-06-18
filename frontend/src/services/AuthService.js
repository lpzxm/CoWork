import ApiService from './ApiService'

export async function apiAuthentication(data)
{
    return ApiService.fetchData({
        url: '/login',
        method: 'POST',
        data: { email: data.identity, password: data.password }
    });
}

export async function apiVerify(data)
{
    return ApiService.fetchData({
        url: '/verify-token',
        method: 'POST',
        data: { email: data.tk, code: data.code }
    });
}

export async function apiSendTwoFactorExpiresAt(data)
{
    return ApiService.fetchData({
        url: '/auth/send-two-factor-expires-at',
        method: 'POST',
        data
    });
}


export async function apiSignUp(data)
{
    return ApiService.fetchData({
        url: '/sign-up',
        method: 'POST',
        data
    })
}

export async function apiSignOut(data)
{
    return ApiService.fetchData({
        url: '/logout',
        method: 'POST',
        data
    })
}

export async function apiForgotPassword(data)
{
    return ApiService.fetchData({
        url: '/password/email',
        method: 'POST',
        data
    })
}

export async function apiChangePassword(data)
{
    return ApiService.fetchData({
        url: '/auth/change-password',
        method: 'POST',
        data
    })
}

export async function apiResetPassword(data)
{
    return ApiService.fetchData({
        url: '/password/reset',
        method: 'POST',
        data
    })
}