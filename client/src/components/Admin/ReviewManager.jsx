import React from 'react';
import { Link } from 'react-router-dom';

function ReviewManager( )
{
	return (
		<div className="admin__page">
			<h2>Reseñas</h2>
			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default ReviewManager;