const server = require( 'express' ).Router( );
const passport = require( 'passport' );
const nodemailer = require( 'nodemailer' );
const Promise = require( 'bluebird' );
const { Op } = require( 'sequelize' );
const { User, ResetToken } = require('../db.js');

const { isAuthenticated, hasAccessLevel, ACCESS_LEVELS } = require( '../passport.js' );
const { ACCESS_LEVEL_USER, ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_SUPER } = ACCESS_LEVELS;

const _thirdOptions = {
	failureRedirect: `${ process.env.FRONT_URL }/login`
};

/* =================================================================================
* 		[ Registra una nueva cuenta de usuario ]
* ================================================================================= */

server.post( '/signup', ( request, response, next ) => {
	if ( request.isAuthenticated( ) ) {
		return response.status( 400 ).send( 'USER_ALREADY_LOGGED_IN' );
	}
	
	const { firstName, lastName, email, password } = request.body;
	
	User.findOrCreate( {
		where: {
			email
		},
		defaults: {
			firstName,
			lastName,
			password
		}
	} )
	.then( ( [ user, created ] ) => {
		if ( !created ) {
			return response.status( 409 ).send( 'USER_ALREADY_EXISTS' );
		}
		
		request.login( user, ( error ) => {
			if ( error ) {
				throw new Error( error );
			}
			
			response.status( 200 ).send( user );
		} );
	} )
	.catch( ( error ) => {
		next( error );
	} );
} );

/* =================================================================================
* 		[ Identifica un usuario con su cuenta ]
* ================================================================================= */

server.post( '/login', passport.authenticate( 'local' ), ( request, response, next ) => {
	response.send( request.user );
} );

/* =================================================================================
* 		[ Devuelve el usuario logueado o 401 en caso contrario ]
* ================================================================================= */

server.get( '/me', isAuthenticated, ( request, response, next ) => {
	response.status( 200 ).send( request.user );
} );

/* =================================================================================
* 		[ Borra la sesión de un usuario ]
* ================================================================================= */

server.get( '/logout', isAuthenticated, ( request, response, next ) => {
	request.logout( );
	response.sendStatus( 200 );
} );

/* =================================================================================
* 		[ Envía un mail al usuario para reestablecer su contraseña ]
* ================================================================================= */

server.post( '/forgot', ( request, response, next ) => {
	const { email } = request.body;
	
	if ( !email ) {
		return response.status( 400 ).send( 'RECOVERY_EMAIL_REQUIRED' );
	}
	
	User.findOne( {
		where: {
			email
		}
	} )
	.then( ( user ) => {
		if ( !user ) {
			response.status( 404 ).send( 'RECOVERY_NOT_EXISTS' );
			
			return null;
		}
		
		return ResetToken.findOrCreate( {
			where: [ {
				userId: user.id,
				used: false,
				expiration: {
					[ Op.gt ]: Date.now( )
				}
			} ],
			defaults: {
				userId: user.id
			}
		} );
	} )
	.then( ( data ) => {
		if ( data === null ) {
			return;
		}
		
		const [ resetToken, created ] = data;
		
		if ( !created ) {
			const now = Date.now( );
			
			if ( ( now - resetToken.requested ) < 300000 ) {
				return response.status( 409 ).send( 'RECOVERY_ALREADY_REQUEST' );
			}
			
			resetToken.update( { request: now } );
		}
		
		const transporter = nodemailer.createTransport( {
			service: 'gmail',
			auth: {
				user: `${ process.env.GMAIL_USER }`,
				pass: `${ process.env.GMAIL_PASSWORD }`
			}
		} );

		const mailOptions = {
			from: `"Six Games" <${ process.env.GMAIL_USER }>`,
			to: email,
			subject: '[Six Games] Reinicio de clave',
			text: '¡Hola! Estás recibiendo este correo porque tú (o alguien más) requirió reestablecer la clave de tu cuenta.\n' +
				'Por favor, presiona en el siguiente enlace para reestablecer tu clave (tienes una hora):\n\n' +
				`${ process.env.FRONT_URL }/reset/${ resetToken.token }\n\n` +
				'Si no fuiste tú quien pidió el reestablecimiento de tu clave, por favor ignora este mensaje.\n'
		};
		
		transporter.sendMail( mailOptions, ( mailError, mailResponse ) => {
			mailError ?
				response.status( 409 ).send( 'RECOVERY_NOT_SENT' ) : response.sendStatus( 200 );
		} );
	} )
	.catch( ( error ) => {
		next( error );
	} );
} );

/* =================================================================================
* 		[ Actualiza la contraseña de un usuario con un token de recuperación ]
* ================================================================================= */

server.post( '/reset/:token', ( request, response, next ) => {
	const { token } = request.params;
	const { password } = request.body;
	
	if ( !token || !password ) {
		return response.status( 400 ).send( 'TOKEN_BAD_REQUEST' );
	}
	
	ResetToken.findOne( {
		where: {
			token: token,
			used: false,
			expiration: {
				[ Op.gt ]: Date.now( )
			}
		},
		include: {
			model: User,
			required: true
		}
	} )
	.then( ( resetToken ) => {
		if ( !resetToken ) {
			response.status( 404 ).send( 'TOKEN_NOT_FOUND' );
			
			return null;
		}
		
		const promises = [ ];
		
		promises.push( resetToken.user.update( { password } ) );
		promises.push( resetToken.update( { used: true } ) );
		
		return Promise.all( promises );
	} )
	.then( ( data ) => {
		if ( data ) {
			response.sendStatus( 200 );
		}
	} )
	.catch( ( error ) => {
		next( error );
	} );
} );

/* =================================================================================
* 		[ Promueve un usuario (incrementa su nivel de acceso) ]
* ================================================================================= */

server.get( '/promote/:id', hasAccessLevel( ACCESS_LEVEL_SUPER ), ( request, response, next ) => {
	const { id } = request.params;
	
	if ( isNaN( id ) ) {
		return response.status( 400 ).send( 'AUTH_ID_NAN' );
	}
	
	User.findByPk( id )
		.then( ( user ) => {
			if ( !user ) {
				return response.status( 404 ).send( 'AUTH_NOT_FOUND' );
			}
			
			if ( user.accessLevel !== ACCESS_LEVEL_USER ) {
				return response.status( 409 ).send( 'AUTH_CANT_PROMOTE' );
			}
			
			user.increment( 'accessLevel', { by: 1 } )
				.then( ( ) => {
					response.sendStatus( 204 );
				} );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Degrada un usuario (decrementa su nivel de acceso) ]
* ================================================================================= */

server.get( '/demote/:id', hasAccessLevel( ACCESS_LEVEL_SUPER ), ( request, response, next ) => {
	const { id } = request.params;
	
	if ( isNaN( id ) ) {
		return response.status( 400 ).send( 'AUTH_ID_NAN' );
	}
	
	User.findByPk( id )
		.then( ( user ) => {
			if ( !user ) {
				return response.status( 404 ).send( 'AUTH_NOT_FOUND' );
			}
			
			if ( user.accessLevel !== ACCESS_LEVEL_ADMIN ) {
				return response.status( 409 ).send( 'AUTH_CANT_DEMOTE' );
			}
			
			user.decrement( 'accessLevel', { by: 1 } )
				.then( ( ) => {
					response.sendStatus( 204 );
				} );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Autenticación por Google ]
* ================================================================================= */

server.get( '/google', passport.authenticate( 'google', { scope: [ 'profile', 'email' ] } ) );
server.get( '/google/callback', passport.authenticate( 'google', _thirdOptions ), ( request, response ) => {
	response.redirect( `${ process.env.FRONT_URL }/products` );
} );

/* =================================================================================
* 		[ Autenticación por Facebook ]
* ================================================================================= */

server.get( '/facebook', passport.authenticate( 'facebook', { scope: 'email' } ) );
server.get( '/facebook/callback', passport.authenticate( 'facebook', _thirdOptions ), ( request, response ) => {
	response.redirect( `${ process.env.FRONT_URL }/products` );
} );

/* =================================================================================
* 		[ Se exportan las rutas ]
* ================================================================================= */

module.exports = server;