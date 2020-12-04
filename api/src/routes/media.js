const server = require( 'express' ).Router( );
const { Media } = require( '../db.js' );
const { hasAccessLevel } = require( '../passport.js' );

/* =================================================================================
* 		[ Creación de un modelo Media ]
* ================================================================================= */

server.post( '/', hasAccessLevel( ), ( request, response, next ) => {
	const { path, type, productId } = request.body;
	
	Media.create( {
			path,
			type,
			productId
		} )
		.then( ( media ) => {
			response.status( 200 ).send( media );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Eliminación de un modelo Media ]
* ================================================================================= */

server.delete( '/:id', hasAccessLevel( ), ( request, response, next ) => {
	let { id } = request.params;
	
	Media.findByPk( id )
		.then( ( media ) => {
			if ( !media ) {
				return response.status( 404 ).send( 'MEDIA_NOT_FOUND' );
			}

			media.destroy( )
				.then( ( ) => {
					response.sendStatus( 204 );
				} );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Exportamos nuestras rutas ]
* ================================================================================= */

module.exports = server;