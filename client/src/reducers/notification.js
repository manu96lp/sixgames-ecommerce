import { actionTypes } from '../constants';

const initialState = {
    message: '',
    options: { }
};

function reducer( state = initialState, action )
{
	switch( action.type )
	{
		case actionTypes.SHOW_NOTIFICATION:
		{
			return {
				...action.payload
			};
        }
        case actionTypes.CLEAR_NOTIFICATION:
        {
            return {
                message: '',
                options: { }
            }
        }
		default:
		{
			return state;
		}
	}
}

export default reducer;