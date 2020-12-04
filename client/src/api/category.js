import { baseApi } from './index';

/* =================================================================================
* 		[ GET /products/category ]
* ================================================================================= */

export function getAllCategories( )
{
    return baseApi.get( `/products/category` );
}

/* =================================================================================
* 		[ POST /products/category ]
* ================================================================================= */

export function addCategory( name, description )
{
    return baseApi.post( `/products/category`, {
        name, description
    } );
}

/* =================================================================================
* 		[ PUT /products/category/:categoryId ]
* ================================================================================= */

export function modifyCategory( id, name, description )
{
    return baseApi.put( `/products/category/${ id }`, {
        name, description
    } );
}

/* =================================================================================
* 		[ DELETE /products/category/:categoryId ]
* ================================================================================= */

export function deleteCategory( categoryId )
{
    return baseApi.delete( `/products/category/${ categoryId }` );
}