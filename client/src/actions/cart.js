import { actionTypes } from '../constants';
import { cartApi } from '../api';
import { showNotification } from '../actions/notification';
import { mergeProducts } from '../utils';

/* =================================================================================
* 			[ Sincroniza el carrito de un usuario ]
* ================================================================================= */

/*
	Si no tiene un carrito creado, le crea uno.
	Si tiene un carrito creado, lo sincroniza con su carrito local actual.
*/

export function sinchronizeCart( userId )
{
	return function( dispatch, getState ) {
		const { products } = getState( ).cart;
		
		let sync = false;
		
		cartApi.getProductsFromCart( userId )
			.then( ( response ) => {
				const mergedProducts = mergeProducts( products, response.data );
				
				dispatch( {
					type: actionTypes.CART_SYNCHRONIZE,
					payload: mergedProducts
				} );
				
				sync = true;
			} )
			.catch( ( error ) => {
				if ( !error.request || ( error.request.status !== 404 ) ) {
					dispatch( {
						type: actionTypes.CART_FAILURE
					} );
					
					return null;
				}
				
				return cartApi.createCart( userId );
			} )
			.then( ( response ) => {
				if ( !response ) {
					return;
				}
				
				dispatch( {
					type: actionTypes.CART_SYNCHRONIZE,
					payload: products
				} );
				
				sync = true;
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CART_FAILURE
				} );
			} )
			.finally( ( ) => {
				if ( sync && ( products.length > 0 ) ) {
					products.forEach( ( { productId, quantity } ) => {
						dispatch( editProductInCart( userId, productId, quantity ) );
					} );
				}
			} );
	};
}

/* =================================================================================
* 			[ Agrega un producto al carrito ]
* ================================================================================= */

/*
	Si no hay producto, y se agrega un producto, se agrega con cantidad 1.
	Si un producto existe, se edita ese producto incrementando su cantidad en 1.
*/

export function addProductToCart( userId, productId )
{
	return function( dispatch, getState ) {
		const cartProduct = getState( ).cart.products.find( ( value ) => value.productId === productId );
		const quantity = !cartProduct ? 1 : ( cartProduct.quantity + 1 );
		
		if ( userId <= 0 ) {
			dispatch( {
				type: actionTypes.CART_EDIT_PRODUCT,
				payload: { productId, quantity }
			} );
			
			return;
		}
		
		cartApi.editProductInCart( userId, productId, quantity )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CART_EDIT_PRODUCT,
					payload: { productId, quantity }
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CART_FAILURE
				} );
				
				dispatch( showNotification( "Ocurrió un error inesperado: " + error, 'error' ) );
			} );
	};
}

/* =================================================================================
* 			[ Editar un producto del carrito ]
* ================================================================================= */

/*
	Si no hay producto, y se edita un producto, se agrega con esa cantidad.
	Si un producto existe, se edita ese producto con la cantidad ingresada.
	Si la cantidad es nula, el producto se elimina del carrito.
*/

export function editProductInCart( userId, productId, quantity )
{
	if ( userId <= 0 )
	{
		return {
			type: actionTypes.CART_EDIT_PRODUCT,
			payload: { productId, quantity }
		};
	}
	
	return function( dispatch ) {
		cartApi.editProductInCart( userId, productId, quantity )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CART_EDIT_PRODUCT,
					payload: { productId, quantity }
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CART_FAILURE
				} );
				
				dispatch( showNotification( "Ocurrió un error inesperado: " + error, 'error' ) );
			} );
	};
}

/* =================================================================================
* 			[ Vaciar el carrito ]
* ================================================================================= */

export function emptyCart( userId )
{
	if ( !userId || ( userId <= 0 ) )
	{
		return {
			type: actionTypes.CART_EMPTY
		};
	}
	
	return function( dispatch ) {
		cartApi.emptyCart( userId )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CART_EMPTY
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CART_FAILURE
				} );
				
				dispatch( showNotification( "Ocurrió un error inesperado: " + error, 'error' ) );
			} );
	};
}