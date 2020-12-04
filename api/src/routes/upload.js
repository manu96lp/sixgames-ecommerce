const server = require( 'express' ).Router( );
const fs = require( 'fs' );
const path = require( 'path' );
const crypto = require( 'crypto' );
const { hasAccessLevel } = require( '../passport.js' );

/* =================================================================================
* 		[ Extensiones válidas para un archivo media ]
* ================================================================================= */

const validExtensions = [
	'.png',
	'.jpg',
	'.jpeg',
	'.webp',
	'.gif',
	'.webm',
	'.mp4',
	'.avi',
	'.flv',
	'.mkv',
	'.mov'
];

/* =================================================================================
* 		[ Subida de un archivo media ]
* ================================================================================= */

server.post( '/', hasAccessLevel( ), ( request, response ) => {
	if ( !request.files ) {
		return response.status( 400 ).send( 'FILE_NOT_EXISTS' );
	}
	
	const { file } = request.files;
	
	const extPos = file.name.lastIndexOf( '.' );
	const extension = file.name.substring( extPos );
	
	if ( ( extPos < 0 ) || !validExtensions.includes( extension ) )
	{
		return response.status( 409 ).send( 'INVALID_EXTENSION' );
	}
	
	const fileName = ( crypto.randomBytes( 16 ).toString( 'hex' ) + extension );
	const filePath = path.join( __dirname, '..', '..', `/public/${ fileName }` );
	
	fs.access( filePath, fs.constants.F_OK, ( error ) => {
		if ( !error ) {
			return response.status( 409 ).send( 'DUPLICATED_HASH' );
		}
		
		file.mv( filePath, ( error ) => {
			if ( error ) {
				return response.status( 409 ).send( 'RELOCATION_ERROR' );
			}
			
			response.status( 200 ).send( fileName );
		} );
	} );
} );

/* =================================================================================
* 		[ Exportamos la ruta ]
* ================================================================================= */

module.exports = server;