import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../actions/auth';
import Loading from "../Loading/Loading.jsx";

function ForgotPassword( )
{
	const isLogged = useSelector( ( state ) => state.auth.isLogged );
    
    const dispatch = useDispatch( );
    const history = useHistory( );
    
	const handleRedirectOnSuccess = ( ) => {
		history.push( "/" );
	}
    
	if ( !isLogged ) {
		return renderNotLoggedIn( );
    }
    
    dispatch( logout( handleRedirectOnSuccess ) );
    
	return (
		<Loading />
	);
};

function renderNotLoggedIn( )
{
	return (
		<div className="auth-modal__page-message">
			<h2>No estás autenticado en una cuenta</h2>
			<p>Si quieres puedes <Link to="/">volver al inicio</Link>.</p>
		</div>
	);
}

export default ForgotPassword;