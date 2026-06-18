import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setUser, initialState as userInitialState } from 'store/auth/userSlice'
import { setEmployee, initialState as empInitialState } from 'store/auth/employeeSlice'
import {
	setFunctionalPosition,
	initialState as functionalPositionInitialState,
} from 'store/auth/functionalPositionSlice'
import {
	setOrganizationalUnit,
	initialState as organizationalUnitInitialState,
} from 'store/auth/organizationalUnitSlice'
import {
	setNotifications,
	initialState as notificationsInitialState,
} from 'store/auth/notificationsSlice'
import {
	setVerificationOn,
	setTk,
	onSignInSuccess,
	onSignOutSuccess,
} from 'store/auth/sessionSlice'

import {
	apiAuthentication,
	apiSignOut,
	apiSignUp,
	apiVerify,
	apiSendTwoFactorExpiresAt,
} from 'services/AuthService'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'

import useQuery from './useQuery'
import appConfig from 'configs/app.config'

let pendingTwoFactorExpiresAtRequest = null
let pendingTwoFactorExpiresAtTk = null

const isSuccessfulResponse = (status) => status >= 200 && status < 300

function useAuth() {
	const query = useQuery()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { token, signedIn, tk } = useSelector((state) => state.auth.session)
	const { user } = useSelector((state) => state.auth)

	const authentication = useCallback(
		async (values) => {
			try {
				const res = await apiAuthentication(values)

				if (res.data && isSuccessfulResponse(res.status)) {
					const { message, email } = res.data

					dispatch(setTk(email))

					dispatch(setVerificationOn(true))

					return { status: res.status, message }
				}

				return {
					status: 'failed',
					message: 'No fue posible autenticar la solicitud.',
				}
			} catch (errors) {
				return {
					status: 'failed',
					message:
						(errors?.response?.data?.error ||
							errors?.response?.data?.message) ||
						errors.toString(),
				}
			}
		},
		[dispatch, navigate]
	)

	const verify = useCallback(
		async (values) => {
			try {
				const payload = { ...values, tk }
				const resp = await apiVerify(payload)

				if (resp.data && isSuccessfulResponse(resp.status)) {
					dispatch(setVerificationOn(false))

					const { token: accessToken, data: nextUser } = resp.data

					if (nextUser) {
						const roles = nextUser.roles || []
						const authority = Array.isArray(roles) ? roles : [];

						dispatch(setUser({
							...nextUser,
							authority,
							permissions: [],
						}))

						dispatch(setEmployee({
							name: nextUser.name || '',
							lastname: '',
							email: nextUser.email || '',
						}))

						dispatch(setFunctionalPosition({
							name: roles[0] || '',
						}))
					}

					if (nextUser && !nextUser.change_password) {
						dispatch(onSignInSuccess(accessToken))

						navigate(appConfig.authenticatedEntryPath)
					}

					return {
						status: resp.status,
						message: '',
					}
				}

				return {
					status: 'failed',
					message: 'No fue posible validar el codigo.',
				}
			} catch (errors) {
				return {
					status: 'failed',
					message:
						errors?.response?.data?.message || errors.toString(),
				}
			}
		},
		[dispatch, navigate, tk]
	)

	const getTwoFactorExpiresAt = useCallback(async () => {
		if (
			pendingTwoFactorExpiresAtRequest &&
			pendingTwoFactorExpiresAtTk === tk
		) {
			return pendingTwoFactorExpiresAtRequest
		}

		const request = (async () => {
			try {
				const values = {}
				if (tk) {
					values.tk = tk
				}
				const resp = await apiSendTwoFactorExpiresAt(values)
				if (resp.data && isSuccessfulResponse(resp.status)) {
					return {
						status: resp.status,
						expires_at: resp.data.expires_at,
					}
				}

				return {
					status: 'failed',
					message:
						'No fue posible obtener la expiracion del codigo.',
				}
			} catch (errors) {
				return {
					status: 'failed',
					message:
						errors?.response?.data?.message || errors.toString(),
				}
			}
		})()

		pendingTwoFactorExpiresAtTk = tk
		pendingTwoFactorExpiresAtRequest = request.finally(() => {
			if (pendingTwoFactorExpiresAtRequest === request) {
				pendingTwoFactorExpiresAtRequest = null
				pendingTwoFactorExpiresAtTk = null
			}
		})

		return pendingTwoFactorExpiresAtRequest
	}, [tk])

	const signUp = useCallback(
		async (values) => {
			try {
				const resp = await apiSignUp(values)
				if (resp.data) {
					const { token: nextToken } = resp.data
					dispatch(onSignInSuccess(nextToken))
					if (resp.data.user) {
						dispatch(
							setUser(
								resp.data.user || {
									avatar: '',
									userName: 'Anonymous',
									authority: ['USER'],
									email: '',
								}
							)
						)
					}
					const redirectUrl = query.get(REDIRECT_URL_KEY)
					navigate(
						redirectUrl
							? redirectUrl
							: appConfig.authenticatedEntryPath
					)
					return {
						status: 'success',
						message: '',
					}
				}
			} catch (errors) {
				return {
					status: 'failed',
					message:
						errors?.response?.data?.message || errors.toString(),
				}
			}
		},
		[dispatch, navigate, query]
	)

	const handleSignOut = useCallback(() => {
		dispatch(onSignOutSuccess())
		dispatch(setUser(userInitialState))
		dispatch(setEmployee(empInitialState))
		dispatch(setFunctionalPosition(functionalPositionInitialState))
		dispatch(setOrganizationalUnit(organizationalUnitInitialState))
		navigate(appConfig.unAuthenticatedEntryPath)
	}, [dispatch, navigate])

	const signOut = useCallback(async () => {
		await apiSignOut()
		handleSignOut()
	}, [handleSignOut])

	return {
		authenticated: token && signedIn,
		user,
		authentication,
		verify,
		getTwoFactorExpiresAt,
		signUp,
		signOut,
	}
}

export default useAuth