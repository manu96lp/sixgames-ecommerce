import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { clearNotification } from '../../actions/notification';

function Notification( )
{
	const { message, options } = useSelector( ( state ) => state.notification );
	const dispatch = useDispatch( );
	
	useEffect( ( ) => {
		if ( message ) {
			toast( message, options );
			
			dispatch( clearNotification( ) );
		}
	}, [ message, options, dispatch ] );
	
	return (
		<ToastContainer />
	);
}

export default Notification;