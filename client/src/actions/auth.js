import { actionTypes } from '../constants';
import { authApi } from '../api';
import { showNotification } from '../actions/notification';
import { emptyCart, sinchronizeCart } from './cart';

/* =================================================================================
* 		[ Iniciar sesión del usuario (email y clave) ]
* ================================================================================= */

export function login( email, password, redirectOnSuccess )
{
	return function( dispatch ) {
		authApi.login( email, password )
			.then( ( response ) => {
				const user = response.data;
				
				dispatch( {
					type: actionTypes.AUTH_LOGIN,
					payload: user
				} );
				
				redirectOnSuccess( );
				
				dispatch( sinchronizeCart( user.id ) );
				dispatch( showNotification( '¡Ingresaste correctamente en tu cuenta!', 'success', 1500 ) );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.AUTH_FAILURE
				} );
				
				dispatch( showNotification( '¡Las credenciales que ingresaste son incorrectas!', 'error' ) );
			} );
	};
}

/* =================================================================================
* 		[ Crear cuenta de usuario (nombre, apellido, email y clave) ]
* ================================================================================= */

export function signUp( firstName, lastName, email, password, redirectOnSuccess )
{
	return function( dispatch ) {
		authApi.signUp( firstName, lastName, email, password )
			.then( ( response ) => {
				const user = response.data;
				
				dispatch( {
					type: actionTypes.AUTH_SIGNUP,
					payload: user
				} );
				
				redirectOnSuccess( );
		
				dispatch( sinchronizeCart( user.id ) );
				dispatch( showNotification( '¡Creaste tu cuenta correctamente!', 'success', 1500 ) );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.AUTH_FAILURE
				} );
				
				( error.request.status === 409 ) ?
					dispatch( showNotification( '¡Ya existe una cuenta con ese email!', 'error' ) ) :
					dispatch( showNotification( 'Ocurrió un error inesperado', 'error' ) );
			} );
	};
}

/* =================================================================================
* 		[ Cerrar sesion del usuario ]
* ================================================================================= */

export function logout( redirectOnSuccess )
{
	return function( dispatch ) {
		authApi.logout( )
			.then( ( response ) => {
				redirectOnSuccess( );
				
				dispatch( showNotification( '¡Cerraste sesión correctamente!', 'success', 1500 ) );
			} )
			.finally( ( ) => {
				dispatch( {
					type: actionTypes.AUTH_LOGOUT
				} );
				
				dispatch( emptyCart( ) );
			} );
	};
}

/* =================================================================================
* 		[ Verifica la sesión del usuario ]
* ================================================================================= */

export function verifySession( )
{
	return function( dispatch, getState ) {
		const { isLogged } = getState( ).auth;
		
		if ( !isLogged ) {
			return;
		}
		
		authApi.me( )
			.then( ( response ) => {
				const user = response.data;
				
				dispatch( {
					type: actionTypes.AUTH_VERIFY,
					payload: user
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.AUTH_FAILURE
				} );
				
				dispatch( emptyCart( ) );
			} );
	};
}