import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

function ProtectedRoute( { component: Component, requiredAccess, ...rest } )
{
	const isLogged = useSelector( ( state ) => state.auth.isLogged );
	const accessLevel = useSelector( ( state ) => state.auth.user.accessLevel );
	
	return <Route { ...rest } render={ ( props ) =>
		( isLogged && ( accessLevel >= ( requiredAccess || 0 ) ) ) ?
			<Component { ...props }/> :
			<Redirect to={ { pathname: "/auth/login", state: { from: props.location } } } />
	} />;
}

export default ProtectedRoute;