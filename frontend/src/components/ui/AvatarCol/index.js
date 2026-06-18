import React from 'react'
import { Avatar } 									from 'components/ui';

const NameColumn = ({imgSrc,name}) =>
{
    return (
        <div className="flex items-center">
			<Avatar size={50} shape="circle" src={ imgSrc ? imgSrc : '/img/avatars/nopic.jpg' }/>
			<span  className='font-bold ml-3'>{`${name}`}</span>
		</div>
	);
}
export default NameColumn