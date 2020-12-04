import { actionTypes } from '../constants';

const initialState = {
	products: [ ],
	count: 0
};

function reducer( state = initialState, action )
{
	switch ( action.type )
	{
		case actionTypes.CART_EDIT_PRODUCT:
		{
			let productsList = [ ...state.products.filter( ( value ) => value.productId !== action.payload.productId ) ];
			let productsCount = productsList.reduce( ( a, p ) => ( a + p.quantity ), 0 );
			
			if ( action.payload.quantity > 0 )
			{
				productsList.push( action.payload );
				productsCount += action.payload.quantity;
			}
			
			productsList = productsList.sort( ( a, b ) => a.productId - b.productId );
			
			return {
				products: productsList,
				count: productsCount
			};
		}
		case actionTypes.CART_EMPTY:
		{
			return {
				products: [ ],
				count: 0
			};
		}
		case actionTypes.CART_SYNCHRONIZE:
		{
			let productsList = action.payload.sort( ( a, b ) => a.productId - b.productId );
			let productsCount = productsList.reduce( ( a, p ) => ( a + p.quantity ), 0 );
			
			return {
				products: productsList,
				count: productsCount
			};
		}
		case actionTypes.CART_FAILURE:
		{
			return {
				products: [ ],
				count: 0
			};
		}
		default:
		{
			return state;
		}
	}
}

export default reducer;