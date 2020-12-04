import { actionTypes } from '../constants';
import { categoryApi } from '../api';
import { showNotification } from './notification';

/* =================================================================================
* 		[ Obtener todas las categorías ]
* ================================================================================= */

export function loadCategories( )
{
	return function( dispatch ) {
		categoryApi.getAllCategories( )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CATEGORY_LOAD_ALL,
					payload: response.data
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CATEGORY_FAILURE
				} );
			} );
	};
}

/* =================================================================================
* 		[ Agregar una categoría ]
* ================================================================================= */

export function addCategory( name, description )
{
	return function( dispatch ) {
		categoryApi.addCategory( name, description )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CATEGORY_ADD,
					payload: response.data
				} );
				
				dispatch( showNotification( 'Categoría añadida correctamente', 'success' ) );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CATEGORY_FAILURE
				} );
				
				dispatch( showNotification( 'Ocurrió un error inesperado', 'error' ) );
			} );
	};
}

/* =================================================================================
* 		[ Modificar el nombre de una categoría ]
* ================================================================================= */

export function modifyCategory( id, name, description )
{
	return function( dispatch ) {
		categoryApi.modifyCategory( id, name, description )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CATEGORY_MODIFY,
					payload: { id, name, description }
				} );
				
				dispatch( showNotification( 'Categoría modificada correctamente', 'success' ) );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CATEGORY_FAILURE
				} );
				
				dispatch( showNotification( 'Ocurrió un error inesperado', 'error' ) );
			} );
	};
}

/* =================================================================================
* 		[ Remover una categoría ]
* ================================================================================= */

export function deleteCategory( id )
{
	return function( dispatch ) {
		categoryApi.deleteCategory( id )
			.then( ( response ) => {
				dispatch( {
					type: actionTypes.CATEGORY_DELETE,
					payload: id
				} );
				
				dispatch( showNotification( 'Categoría eliminada correctamente', 'success' ) );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: actionTypes.CATEGORY_FAILURE
				} );
				
				dispatch( showNotification( 'Ocurrió un error inesperado', 'error' ) );
			} );
	};
}