import { baseApi } from './index';

/* =================================================================================
* 		[ GET /products/ ]
* ================================================================================= */

export function getAllProducts( query )
{
	return baseApi.get( `/products${ query }` );
}

/* =================================================================================
* 		[ GET /products/some ]
* ================================================================================= */

export function getProductsById( ids )
{
	return baseApi.get( `/products/some`, { ids } );
}

/* =================================================================================
* 		[ GET /products/:id ]
* ================================================================================= */

export function getProductById( id )
{
	return baseApi.get( `/products/${ id }` );
}

/* =================================================================================
* 		[ DELETE /products/:id ]
* ================================================================================= */

export function deleteProductById( id )
{
	return baseApi.delete( `/products/${ id }` );
}

/* =================================================================================
* 		[ POST /products/ ]
* ================================================================================= */
	
export function createProduct( data )
{
	return baseApi.post( '/products/', data );
}

/* =================================================================================
* 		[ PUT /products/:id ]
* ================================================================================= */

export function updateProduct( id, data )
{
	return baseApi.put( `/products/${ id }`, data );
}