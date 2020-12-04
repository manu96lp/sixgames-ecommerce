import { toast } from 'react-toastify';
import defaultPortrait from '../assets/portrait.png';

const API_URL = process.env.REACT_APP_API_URL;

/* =================================================================================
* 			[ Busca y devuelve la portada de un producto ]
* ================================================================================= */

export function getProductPortrait( media )
{
    if ( !media || ( media.length === 0 ) ) {
        return defaultPortrait;
    }
    
    const portrait = media.find( m => m.type === 'portrait' );
    
    if ( !portrait ) {
        return defaultPortrait;
    }
    
    if ( !portrait.path.includes( '/' ) ) {
        return `${ API_URL }/${ portrait.path }`;
    }
    
    return portrait.path;
}

/* =================================================================================
* 			[ Devuelve el precio en formato "00,00" ]
* ================================================================================= */

export function getProductPrice( price )
{
    return price.toLocaleString( 'es-ES', { minimumFractionDigits: 2 } );
}

/* =================================================================================
* 			[ Une el carrito local y el remoto (priorizando el local) ]
* ================================================================================= */

export function mergeProducts( cartProducts, userProducts )
{
	const merger = ( acc, curr ) => {
		if ( !acc.find( ( v ) => v.productId === curr.id ) ) {
			acc.push( { productId: curr.id, quantity: curr.OrderProduct.quantity } );
		}
		
		return acc;
	};
	
	return userProducts.reduce( merger, cartProducts );
}

/* =================================================================================
* 			[ Verifica si una clave es válida ]
* ================================================================================= */

export function isValidPassword( password )
{
	return ( !!password && ( password.length >= 4 ) );
}

/* =================================================================================
* 			[ Verifica si un email es válido ]
* ================================================================================= */

export function isValidEmail( email )
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email );
};

/* =================================================================================
* 		[ Envía una notificación de success ]
* ================================================================================= */

export function showSuccess( message, holdtime = 3000, progressBar = true )
{
	toast.success( message, {
		position: 'top-right',
		autoClose: holdtime,
		hideProgressBar: !progressBar,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined
	} );
}

/* =================================================================================
* 		[ Envía una notificación de information ]
* ================================================================================= */

export function showInformation( message, holdtime = 3000, progressBar = true )
{
	toast.info( message, {
		position: 'top-right',
		autoClose: holdtime,
		hideProgressBar: !progressBar,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined
	} );
}

/* =================================================================================
* 		[ Envía una notificación de error ]
* ================================================================================= */

export function showError( message, holdtime = 3000, progressBar = true )
{
	toast.error( message, {
		position: 'top-right',
		autoClose: holdtime,
		hideProgressBar: !progressBar,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined
	} );
}