import { actionTypes } from '../constants';

const initialState = {
	categories: [ ]
};

function reducer( state = initialState, action )
{
	switch( action.type )
	{
		case actionTypes.CATEGORY_ADD:
		{
			let newCats;
			
			newCats = [ ...state.categories, action.payload ];
			newCats = newCats.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
			
			return {
				...state,
				categories: newCats
			};
		}
		case actionTypes.CATEGORY_MODIFY:
		{
			let newCats;
			
			newCats = [ ...state.categories.filter( c => c.id !== action.payload.id ), action.payload ];
			newCats = newCats.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
			
			return {
				...state,
				categories: newCats
			}
		}
		case actionTypes.CATEGORY_DELETE:
		{
			return {
				...state,
				categories: state.categories.filter( c => c.id !== action.payload )
			}
		}
		case actionTypes.CATEGORY_LOAD_ALL:
		{	
			return {
				...state,
				categories: action.payload
			}
		}
		case actionTypes.CATEGORY_FAILURE:
		{	
			return {
				...state
			}
		}
		default:
		{
			return state;
		}
	}
}

export default reducer;