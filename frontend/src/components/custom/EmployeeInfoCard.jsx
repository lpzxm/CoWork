import React, { useEffect, useReducer } from 'react'
import classNames from 'classnames'
import { Avatar, Spinner } from 'components/ui'
import { HiOutlineUser,HiMail,HiPhone} from 'react-icons/hi'
import { BsFillDiagram2Fill } from 'react-icons/bs'

import { apiGetEmployeeShowPic } from 'services/AdministrationService'

const getEmployeeShowPic = async (id) => {
	const res = await apiGetEmployeeShowPic(id)
	return res.data
}

const initialEmployeeState = {
	employee: null,
	loading: true,
}

function employeeCardReducer(state, action) {
	switch (action.type) {
		case 'loading':
			return { employee: state.employee, loading: true }
		case 'resolved':
			return { employee: action.employee, loading: false }
		default:
			return state
	}
}

const EmployeeInfoCard = ({ employeeId, className }) => {

	const [{ employee, loading }, dispatch] = useReducer(
		employeeCardReducer,
		initialEmployeeState
	)

	useEffect(() => {
		let isActive = true

		dispatch({ type: 'loading' })

		getEmployeeShowPic(employeeId ?? null)
			.then((nextEmployee) => {
				if (isActive) {
					dispatch({ type: 'resolved', employee: nextEmployee })
				}
			})
			.catch(() => {
				if (isActive) {
					dispatch({ type: 'resolved', employee: null })
				}
			})

		return () => {
			isActive = false
		}
	}, [employeeId])

	
	return (

		<div className={className}>
			{employee ? (
				<>
					<div className='flex justify-start items-center mb-5 pb-2'>
						<h5 className={`font-semibold`}>
							{`${employee?.name?employee.name:'-'} ${employee?.lastname?employee.lastname:'-'}`}
						</h5>
					</div>
					<div className={classNames(`flex justify-start items-center gap-5`)}>
						
						<Avatar size={150} src={employee?.photo ? employee.photo : '/img/avatars/nopic.jpg'} shape="rounded" icon={<HiOutlineUser />} />
						
						<div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>

							<div className={`flex justify-start items-start gap-2 w-full font-bold`}>
								<div className='w-1/12'>
									<HiOutlineUser className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.functional_position?employee.functional_position:'-'}`}</span>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<BsFillDiagram2Fill className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.organizational_unit?employee.organizational_unit:'-'}`}</span>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<HiMail className="text-lg" />
								</div>
								<div className='w-10/12'>
									<a href={`mailto:${employee?.email?employee.email:'-'}`}>
										<span>{`${employee?.email?employee.email:'-'}`}</span>
									</a>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<HiPhone className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.phone?employee.phone:'-'}`}</span>
								</div>
							</div>
							
						</div>
					</div>
				</>
				) : loading ? (
					<div className='flex justify-center items-center h-full'>
                        <Spinner size="3.25rem" />
                    </div>
				) : null}
		</div>

	)
}

export default EmployeeInfoCard
