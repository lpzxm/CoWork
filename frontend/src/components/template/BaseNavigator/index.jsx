import React from 'react';
import Button from 'components/ui/Buttons';

const BaseNavigator = props =>
{
    const { navOptions } = props;
    return (
        <>
        {
            navOptions.map((e,i) =>
            {
                return <Button
                    key={e.key || e.name || i}
                    type="button"
                    variant="solid"
                >
                    {e.name}
                </Button>
            })
        }
		</>
	);
}

export default BaseNavigator;