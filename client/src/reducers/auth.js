import { actionTypes } from '../constants';

const initialState = {
	isLogged: false,
	user: {
		id: 0,
		firstName: '',
		lastName: '',
		email: '',
		accessLevel: 0,
		isLogged: false
	}
};

function reducer( state = initialState, action )
{
	switch ( action.type )
	{
		case actionTypes.AUTH_LOGIN:
		{
			return {
				user: action.payload,
				isLogged: true
			};
		}
		case actionTypes.AUTH_SIGNUP:
		{
			return {
				user: action.payload,
				isLogged: true
			};
		}
		case actionTypes.AUTH_LOGOUT:
		{
			return {
				...initialState
			};
		}
		case actionTypes.AUTH_VERIFY:
		{
			return {
				...state,
				user: action.payload
			};
		}
		case actionTypes.AUTH_FAILURE:
		{
			return {
				...state,
				isLogged: false
			};
		}
		default:
		{
			return state;
		}
	}
}

export default reducer;