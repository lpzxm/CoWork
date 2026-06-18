import { Response } from 'miragejs'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'

const MOCK_TK = 'mock-two-factor-token'
const MOCK_2FA_CODE = '123456'

let mockTwoFactorExpiresAt = null

const buildMockAuthPayload = (user) => ({
    user: {
        id: user.id,
        name: 'Usuario',
        lastname: 'Demo',
        username: user.accountUserName,
        email: user.email,
        status: 'active',
        authority: user.authority,
        change_password: false,
    },
    employee: {
        id: user.id,
        name: 'Usuario',
        lastname: 'Demo',
        email: user.email,
        phone: '555-0100',
        photo: user.avatar,
    },
    functional_position: {
        id: 'fp-1',
        name: 'Demo',
        status: 'active',
    },
    organizational_unit: {
        id: 'ou-1',
        name: 'Tecnologia',
        status: 'active',
    },
    notifications: {
        notifications: [],
    },
    access_token: 'mock-access-token',
})

export default function authFakeApi(server, apiPrefix) {
    server.post(`${apiPrefix}/auth/authentication`, (schema, { requestBody }) => {
        const { identity, userName, password } = JSON.parse(requestBody)
        const account = identity || userName
        const user = schema.db.signInUserData.findBy({
            accountUserName: account,
            password,
        }) || schema.db.signInUserData.findBy({
            email: account,
            password,
        })

        if (!user) {
            return new Response(
                401,
                { some: 'header' },
                {
                    message:
                        'Credenciales invalidas. Usa usuario admin y contraseña 123Qwe',
                }
            )
        }

        mockTwoFactorExpiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString()

        return {
            message: `Codigo de verificacion generado. Usa ${MOCK_2FA_CODE}`,
            tk: MOCK_TK,
            change_password: false,
        }
    })

    server.post(`${apiPrefix}/auth/send-two-factor-expires-at`, (_, { requestBody }) => {
        const payload = requestBody ? JSON.parse(requestBody) : {}

        if (payload.tk !== MOCK_TK || !mockTwoFactorExpiresAt) {
            return new Response(
                401,
                { some: 'header' },
                { message: 'Sesion de verificacion invalida o expirada' }
            )
        }

        return {
            expires_at: mockTwoFactorExpiresAt,
        }
    })

    server.post(`${apiPrefix}/auth/verify`, (schema, { requestBody }) => {
        const { code, tk } = JSON.parse(requestBody)

        if (tk !== MOCK_TK || !mockTwoFactorExpiresAt) {
            return new Response(
                401,
                { some: 'header' },
                { message: 'Sesion de verificacion invalida o expirada' }
            )
        }

        if (new Date(mockTwoFactorExpiresAt).getTime() <= Date.now()) {
            mockTwoFactorExpiresAt = null
            return new Response(
                401,
                { some: 'header' },
                { message: 'El codigo de verificacion ha expirado' }
            )
        }

        if (code !== MOCK_2FA_CODE) {
            return new Response(
                401,
                { some: 'header' },
                { message: `Codigo invalido. Usa ${MOCK_2FA_CODE}` }
            )
        }

        const user = schema.db.signInUserData.findBy({
            accountUserName: 'admin',
        })

        mockTwoFactorExpiresAt = null

        return buildMockAuthPayload(user)
    })

    server.post(`${apiPrefix}/sign-in`, (schema, { requestBody }) => {
        const { userName, password } = JSON.parse(requestBody)
        const user = schema.db.signInUserData.findBy({
            accountUserName: userName,
            password,
        })
        if (user) {
            const { avatar, userName, email, authority } = user
            return {
                user: { avatar, userName, email, authority },
                token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
            }
        }
        return new Response(
            401,
            { some: 'header' },
            { message: `userName: admin | password: 123Qwe` }
        )
    })

    server.post(`${apiPrefix}/sign-out`, () => {
        return true
    })

    server.post(`${apiPrefix}/auth/signout`, () => {
        mockTwoFactorExpiresAt = null
        return true
    })

    server.post(`${apiPrefix}/sign-up`, (schema, { requestBody }) => {
        const { userName, password, email } = JSON.parse(requestBody)
        const userExist = schema.db.signInUserData.findBy({
            accountUserName: userName,
        })
        const emailUsed = schema.db.signInUserData.findBy({ email })
        const newUser = {
            avatar: '/img/avatars/thumb-1.jpg',
            userName,
            email,
            authority: ['admin', 'user'],
        }
        if (!isEmpty(userExist)) {
            const errors = [
                { message: '', domain: 'global', reason: 'invalid' },
            ]
            return new Response(
                400,
                { some: 'header' },
                { errors, message: 'User already exist!' }
            )
        }

        if (!isEmpty(emailUsed)) {
            const errors = [
                { message: '', domain: 'global', reason: 'invalid' },
            ]
            return new Response(
                400,
                { some: 'header' },
                { errors, message: 'Email already used' }
            )
        }

        schema.db.signInUserData.insert({
            ...newUser,
            ...{ id: uniqueId('user_'), password, accountUserName: userName },
        })
        return {
            user: newUser,
            token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
        }
    })

    server.post(`${apiPrefix}/forgot-password`, () => {
        return true
    })

    server.post(`${apiPrefix}/reset-password`, () => {
        return true
    })

    server.post(`${apiPrefix}/password/email`, () => {
        return true
    })

    server.post(`${apiPrefix}/password/reset`, () => {
        return true
    })
}
