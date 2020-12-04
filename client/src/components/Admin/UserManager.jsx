import React from 'react';
import { Link } from 'react-router-dom';

function UsersManager( )
{
	return (
		<div className="admin__page">
			<h2>Usuarios</h2>
			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default UsersManager;