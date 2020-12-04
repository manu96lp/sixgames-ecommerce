import { baseApi } from './index';

/* =================================================================================
* 		[ POST /auth/signup (nombre, apellido, email y clave) ]
* ================================================================================= */

export function signUp( firstName, lastName, email, password )
{
	return baseApi.post( `/auth/signup`, {
		firstName, lastName, email, password
	} );
}

/* =================================================================================
* 		[ POST /auth/login (email y clave) ]
* ================================================================================= */

export function login( email, password )
{
	return baseApi.post( `/auth/login`, {
		email, password
	} );
}

/* =================================================================================
* 		[ GET /auth/me ]
* ================================================================================= */

export function me( )
{
	return baseApi.get( `/auth/me` );
}

/* =================================================================================
* 		[ GET /auth/logout ]
* ================================================================================= */

export function logout( )
{
	return baseApi.get( `/auth/logout` );
}

/* =================================================================================
* 		[ POST /auth/forgot (email) ]
* ================================================================================= */

export function forgotPassword( email )
{
	return baseApi.post( `/auth/forgot`, {
		email
	} );
}

/* =================================================================================
* 		[ POST /auth/reset/:token (token y clave) ]
* ================================================================================= */

export function resetPassword( token, password )
{
	return baseApi.post( `/auth/reset/${ token }`, {
		password
	} );
}