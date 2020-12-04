import React from 'react';
import { Link } from 'react-router-dom';

function OfferManager( )
{
	return (
		<div className="admin__page">
			<h2>Ofertas</h2>
			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default OfferManager;