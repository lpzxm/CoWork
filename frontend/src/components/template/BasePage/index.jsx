import React from 'react';
import { AdaptableCard } from 'components/shared';
// import BaseNavigator from 'components/template/BaseNavigator';

const BasePage = props =>
{
    const {title,subtitle,info,children} = props;
	return (
		<>
			<AdaptableCard className="h-full" bodyClass="h-full">

				<div className='flex justify-between items-center'>

					<div className =
					{`
						xs:flex xs:flex-col xs:justify-between xs:items-start xs:gap-1
						md:flex-col md:justify-start md:items-start md:gap-5
					`}
					>
						
						<div>
							<h3 className=
							{`
								xs:flex xs:justify-start xs:items-center xs:gap-2
								md:justify-start md:gap-3
							`}
							>
								<span>{title}</span>
							</h3>
						</div>

						<div>
							<h4 className='text-slate-600'>
								<span>{subtitle}</span>
							</h4>
						</div>

						<div>
							<p>{info}</p>
						</div>

					</div>
					<div>
					</div>
				</div>

				<div>
					{children}
				</div>
			</AdaptableCard>
		</>
	);
}

export default BasePage;