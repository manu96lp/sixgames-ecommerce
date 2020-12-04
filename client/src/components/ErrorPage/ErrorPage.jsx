import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage( { type } )
{
	return (
		<div className="error-page__wrapper">
			<h2>{ type }</h2>
			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default ErrorPage;