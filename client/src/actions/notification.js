import { toast } from 'react-toastify';
import { actionTypes } from '../constants';

const _toastTypes = {
	info: toast.TYPE.INFO,
	error: toast.TYPE.ERROR,
	success: toast.TYPE.SUCCESS
}

/* =================================================================================
* 		[ Envía una notificación ]
* ================================================================================= */

export function showNotification( message, type = 'success', holdtime = 3000 )
{
	const options = {
		position: 'top-right',
		autoClose: holdtime,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined,
		type: ( _toastTypes[ type ] || 'success' )
	};
	
	return {
		type: actionTypes.SHOW_NOTIFICATION,
		payload: { message, options }
	};
}

/* =================================================================================
* 		[ Reinicia el estado de las notificaciones ]
* ================================================================================= */

export function clearNotification( )
{
	return {
		type: actionTypes.CLEAR_NOTIFICATION
	};
}