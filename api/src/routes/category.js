const server = require( 'express' ).Router( );
const { Category, Media } = require( '../db.js' );
const { Op } = require( 'sequelize' );
const { hasAccessLevel } = require( '../passport.js' );

/* =================================================================================
* 		[ Búsqueda de productos por categoría ]
* ================================================================================= */

server.get( '/:id/related', ( request, response ) => {
	const { id } = request.params;
	
	Category.findByPk( id ).then( ( category ) => {
		if ( !category ) {
			return response.sendStatus( 404 );
		}
		
		category.getProducts( {
			include: [
				{ model: Media }
			]
		} ).then( ( products ) => {
			response.status( 200 ).send( products );
		} );
	} );
} );

/* =================================================================================
* 		[ Obtención de una categoria ]
* ================================================================================= */

server.get( '/:id', ( request, response ) => {
	const { id } = request.params;
	
	Category.findByPk( id )
		.then( ( category ) => {
			if ( !category ) {
				return response.sendStatus( 404 );
			}
			
			response.status( 200 ).send( category );
		} );
} );

/* =================================================================================
* 		[ Obtención de todas las categorías ]
* ================================================================================= */

server.get( '/', ( request, response ) => {
	const { query, limit = 1000, page = 0 } = request.query;
	
	const findOptions = {
		where: query && {
			name: { [ Op.iLike ]: `%${ query }%` }
		},
		limit: limit,
		offset: ( page * limit )
	};
	
	Category.findAll( findOptions )
		.then( ( categories ) => {
			response.status( 200 ).send( categories );
		} );
} );

/* =================================================================================
* 		[ Creación de una categoría ]
* ================================================================================= */

server.post( '/', hasAccessLevel( ), ( request, response ) => {
	const { name } = request.body;
	
	Category.findOne( {
		where: {
			name: { [ Op.iLike ]: name }
		}
	} )
	.then( category => {
		if ( category ) {
			return response.status( 409 ).send( 'Categoría ya existe' );
		}
		
		Category.create( {
			...request.body
		}, {
			fields: [ 'name', 'description' ]
		} ).then( ( category ) => {
			response.status( 200 ).send( category );
		} );
	} );
} );

/* =================================================================================
* 		[ Modificación de una categoría ]
* ================================================================================= */

server.put( '/:id', hasAccessLevel( ), ( request, response ) => {
	const { id } = request.params;
	
	Category.findByPk( id ).then( ( category ) => {
		if ( !category ) {
			return response.status( 404 ).send( 'Categoría inexistente' );
		}
		
		category.update( {
			...request.body
		}, {
			fields: [ 'name', 'description' ]
		} )
		.then( ( category ) => {
			response.status( 200 ).send( category );
		} );
	} );
} );

/* =================================================================================
* 		[ Eliminación de una categoría ]
* ================================================================================= */

server.delete( '/:id', hasAccessLevel( ), ( request, response ) => {
	const { id } = request.params;
	
	Category.findByPk( id ).then( category => {
		if ( !category ) {
			return response.status( 404 ).send( 'Categoría inexistente' );
		}

		category.destroy( ).then( ( ) => {
			response.sendStatus( 204 );
		} );
	} );
} );

/* =================================================================================
* 		[ Exportamos nuestras rutas ]
* ================================================================================= */

module.exports = server;