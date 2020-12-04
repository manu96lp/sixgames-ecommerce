const server = require( 'express' ).Router( );
const { Op } = require( 'sequelize' );
const { Order, Product, User } = require( '../db.js' );

const { isAuthenticated, hasAccessLevel, ACCESS_LEVELS } = require( '../passport.js' );
const { ACCESS_LEVEL_USER } = ACCESS_LEVELS;

/* =================================================================================
* 		[ Búsqueda y/o obtención de todas las órdenes ]
* ================================================================================= */

/*
	- Puede recibir un "status" en query para devolver solo las órdenes que pertenezcan a un estado en particular
	- Puede recibir mas de un status separados por comas para buscar por varios status a la vez (OR)
	- Devuelve las órdenes ordenadas por fecha de creación (de más nueva a mas vieja)
*/

server.get( '/', hasAccessLevel( ), ( request, response, next ) => {
	const {
		status = 'completed',
		query = '',
		limit = 5,
		page = 0
	} = request.query;
	
	const options = {
		where: status && {
			status: { [ Op.iLike ]: status }
		},
		order: [
			[ 'createdAt', 'DESC' ]
		],
		include: [
			{
				model: Product
			},
			{
				model: User,
				where: query && {
					name: { [ Op.iLike ]: `%${ query }%` }
				}
			}
		],
		limit,
		offset: ( page * limit ),
		distinct: true
	};
	
	Order.findAndCountAll( options )
		.then( ( orders ) => {
			response.status( 200 ).send( orders );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Búsqueda de una orden por identificador ]
* ================================================================================= */

server.get( '/:id', isAuthenticated, ( request, response, next ) => {
	let { id } = request.params;
	
	Order.findByPk( id, {
			include: [
				{ model: Product },
				{ model: User }
			]
		} )
		.then( ( order ) => {
			if ( !order ) {
				return response.status( 404 ).send( 'ORDER_NOT_FOUND' );
			}
			
			if ( ( order.user.id !== request.user.id ) && ( request.user.accessLevel === ACCESS_LEVEL_USER ) ) {
				return response.status( 401 ).send( 'ORDER_NOT_VISUALIZABLE' );
			}
			
			response.status( 200 ).send( order );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Modificación de una orden ]
* ================================================================================= */

/*
	- Se pasan por body las propiedades a cambiar con sus respectivos valores
*/

server.put( '/:id',  hasAccessLevel( ), ( request, response, next ) => {
	const { id } = request.params;
	const { status } = request.body;
	
	Order.findByPk( id )
		.then( ( order ) => {
			if ( !order ) {
				response.status( 404 ).send( 'ORDER_NOT_FOUND' );
				
				return null;
			}
			
			return order.update( {
				status
			} );
		} )
		.then( ( order ) => {
			if ( order ) {
				response.status( 200 ).send( order );
			}
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Exportamos nuestras rutas ]
* ================================================================================= */

module.exports = server;