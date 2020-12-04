import { baseApi } from './index';

/* =================================================================================
* 		[ GET /users/:userId/cart ]
* ================================================================================= */

export function getProductsFromCart( userId )
{
	return baseApi.get( `/users/${ userId }/cart`, {
		withCredentials: true
	} );
}

/* =================================================================================
* 		[ POST /users/:userId/cart ]
* ================================================================================= */

export function createCart( userId )
{
	return baseApi.post( `/users/${ userId }/cart` );
}

/* =================================================================================
* 		[ PUT /users/:userId/cart ]
* ================================================================================= */

export function editProductInCart( userId, productId, quantity )
{
	return baseApi.put( `/users/${ userId }/cart`, {
		productId, quantity
	} );
}

/* =================================================================================
* 		[ DELETE /users/:userId/cart ]
* ================================================================================= */

export function emptyCart( userId )
{
	return baseApi.delete( `/users/${ userId }/cart` );
}