/* =================================================================================
* 		[ Acciones de Categoría ]
* ================================================================================= */

const CATEGORY_ADD 			= 'CATEGORY_ADD';
const CATEGORY_MODIFY 		= 'CATEGORY_MODIFY';
const CATEGORY_DELETE 		= 'CATEGORY_DELETE';
const CATEGORY_LOAD_ALL 	= 'CATEGORY_LOAD_ALL';
const CATEGORY_FAILURE 		= 'CATEGORY_FAILURE';

/* =================================================================================
* 		[ Acciones de Usuario ]
* ================================================================================= */

const AUTH_LOGIN 			= 'AUTH_LOGIN';
const AUTH_SIGNUP 			= 'AUTH_SIGNUP';
const AUTH_LOGOUT 			= 'AUTH_LOGOUT';
const AUTH_VERIFY 			= 'AUTH_VERIFY';
const AUTH_FAILURE 			= 'AUTH_FAILURE';

/* =================================================================================
* 		[ Acciones de Carrito ]
* ================================================================================= */

const CART_EDIT_PRODUCT 	= 'CART_EDIT_PRODUCT';
const CART_EMPTY 			= 'CART_EMPTY';
const CART_SYNCHRONIZE 		= 'CART_SYNCHRONIZE';
const CART_FAILURE 			= 'CART_FAILURE';

/* =================================================================================
* 		[ Acciones de Notificaciones ]
* ================================================================================= */

const SHOW_NOTIFICATION 	= 'SHOW_NOTIFICATION';
const CLEAR_NOTIFICATION 	= 'CLEAR_NOTIFICATION';

/* =================================================================================
* 		[ Exportamos las constantes ]
* ================================================================================= */

const actionTypes = {
	CATEGORY_ADD,
	CATEGORY_MODIFY,
	CATEGORY_DELETE,
	CATEGORY_LOAD_ALL,
	CATEGORY_FAILURE,
	AUTH_LOGIN,
	AUTH_SIGNUP,
	AUTH_LOGOUT,
	AUTH_VERIFY,
	AUTH_FAILURE,
	CART_EDIT_PRODUCT,
	CART_EMPTY,
	CART_SYNCHRONIZE,
	CART_FAILURE,
	SHOW_NOTIFICATION,
	CLEAR_NOTIFICATION
};

export {
	actionTypes
};