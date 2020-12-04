import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard( )
{
	return (
		<div className="admin__page">
			<h2>Dashboard</h2>
			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default AdminDashboard;