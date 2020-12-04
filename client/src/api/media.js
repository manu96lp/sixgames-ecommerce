import { baseApi } from './index';

/* =================================================================================
* 		[ POST /uploads/ (file) ]
* ================================================================================= */

export function uploadFile( data )
{
	return baseApi.post( `/uploads/`, data );
}

/* =================================================================================
* 		[ POST /medias/ (alias, type, path) ]
* ================================================================================= */
		
export function createMedia( type, path )
{
	return baseApi.post( `/medias/`, {
		type, path
	} );
}