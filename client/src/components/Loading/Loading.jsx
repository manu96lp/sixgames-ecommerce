import React from 'react';
import loadingCircle from '../../assets/loading.svg';

function Loading( )
{
	return (
		<div className='loading-spinner'>
			<img src={ loadingCircle } alt='Loading Spinner'/>
		</div>
	);
}

export default Loading;