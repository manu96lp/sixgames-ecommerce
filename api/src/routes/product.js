const server = require( 'express' ).Router( );
const Promise = require( 'bluebird' );
const sequelize = require( 'sequelize' );
const { Op, QueryTypes } = sequelize;
const { Product, Category, Media, Review, Order, conn } = require( '../db.js' );
const { isAuthenticated, hasAccessLevel } = require( '../passport.js' );

/* =================================================================================
* 		[ Métodos y constantes de ayuda para las rutas ]
* ================================================================================= */

const _SORT_FIELDS = [
	'name',
	'price',
	'publishDate'
];

const _SORT_DIRECTIONS = [
	'ASC',
	'DESC'
];

const _MAX_PRICE = 200.0;
const _MAX_PAGE = 1000;

const _MIN_PER_PAGE = 5;
const _MAX_PER_PAGE = 50;
const _DEF_PER_PAGE = 50;

const _clamp = ( value, min, max ) => {
	return Math.max( min, Math.min( max, value ) );
};

const queryWithCategories = [
	`SELECT "product".*, "media".*, "categories"."id",`,
	`(`,
		`SELECT COUNT( DISTINCT( "product"."id" ) )`,
		`FROM "products" AS "product"`,
		`INNER JOIN "product_category" ON "product_category"."productId" = "product"."id"`,
		`INNER JOIN "categories" ON "product_category"."categoryId" = "categories"."id"`,
		`WHERE ( "categories"."id" IN( :list ) AND ( "product"."price" <= ':maxPrice' ) AND ( "product"."price" >= ':minPrice' ) AND ( "product"."name" ILIKE :query ) )`,
		`HAVING COUNT( "product"."id" ) >= :listCount`,
	`) AS "count"`,
	`FROM`,
	`(`,
		`SELECT "product".*`,
		`FROM "products" AS "product"`,
		`INNER JOIN "product_category" ON "product_category"."productId" = "product"."id"`,
		`INNER JOIN "categories" ON "product_category"."categoryId" = "categories"."id"`,
		`WHERE ( "categories"."id" IN( :list ) AND ( "product"."price" <= ':maxPrice' ) AND ( "product"."price" >= ':minPrice' ) AND ( "product"."name" ILIKE :query ) )`,
		`GROUP BY "product"."id"`,
		`HAVING COUNT( "product"."id" ) >= :listCount`,
		`LIMIT :limit OFFSET :offset`,
	`) AS "product"`,
	`LEFT OUTER JOIN "media" ON "product"."id" = "media"."productId"`,
	`LEFT OUTER JOIN ( "product_category" AS "categories->ProductCategory" INNER JOIN "categories" AS "categories" ON "categories"."id" = "categories->ProductCategory"."categoryId" ) ON "product"."id" = "categories->ProductCategory"."productId"`,
	`ORDER BY :sortBy :sortDir`
].join( ' ' );

const queryWithoutCategories = [
	`SELECT "product".*, "media".*, "categories"."id",`,
	`(`,
		`SELECT COUNT( DISTINCT( "product"."id" ) )`,
		`FROM "products" AS "product"`,
		`WHERE ( ( "product"."price" <= ':maxPrice' ) AND ( "product"."price" >= ':minPrice' ) AND ( "product"."name" ILIKE :query ) )`,
	`) AS "count"`,
	`FROM`,
	`(`,
		`SELECT "product".*`,
		`FROM "products" AS "product"`,
		`WHERE ( ( "product"."price" <= ':maxPrice' ) AND ( "product"."price" >= ':minPrice' ) AND ( "product"."name" ILIKE :query ) )`,
		`GROUP BY "product"."id"`,
		`LIMIT :limit OFFSET :offset`,
	`) AS "product"`,
	`LEFT OUTER JOIN "media" ON "product"."id" = "media"."productId"`,
	`LEFT OUTER JOIN ( "product_category" AS "categories->ProductCategory" INNER JOIN "categories" AS "categories" ON "categories"."id" = "categories->ProductCategory"."categoryId" ) ON "product"."id" = "categories->ProductCategory"."productId"`,
	`ORDER BY :orderBy`
].join( ' ' );

const getFilteredProducts = ( options ) => {
	let query;
	
	query = ( options.categories.length > 0 ) ? queryWithCategories : queryWithoutCategories;
	query = query.replace( ':orderBy', `${ options.sortBy } ${ options.sortDir }` );
	
	return conn.query( query, {
		replacements: {
			query: options.query,
			limit: options.limit,
			offset: ( options.page * options.limit ),
			minPrice: options.minPrice,
			maxPrice: options.maxPrice,
			sortBy: options.sortBy,
			list: options.categories,
			listCount: options.categories.length
		},
		type: QueryTypes.SELECT
	} );
}

/* =================================================================================
* 		[ Obtención de todos los productos ]
* ================================================================================= */

server.get( '/', ( request, response, next ) => {
	const { query, categories, sortBy, sortDir, minPrice, maxPrice, page, limit } = request.query;
	const options = {
		query: ( query && `%${ query }%` ) || '%%',
		
		limit: _clamp( ( limit || _DEF_PER_PAGE ), _MIN_PER_PAGE, _MAX_PER_PAGE ),
		page: _clamp( ( page || 0 ), 0, _MAX_PAGE ),
		
		minPrice: _clamp( ( minPrice || 0.0 ), 0.0, _MAX_PRICE ),
		maxPrice: _clamp( ( maxPrice || _MAX_PRICE ), 0.0, _MAX_PRICE ),
		
		sortBy: _SORT_FIELDS.find( v => sortBy === v ) || _SORT_FIELDS[ 0 ],
		sortDir: _SORT_DIRECTIONS.find( v => sortDir === v ) || _SORT_DIRECTIONS[ 0 ],
		
		categories: ( Array.isArray( categories ) && categories.split( ',' ).map( c => parseInt( c ) || undefined ) ) || [ ]
	};
	
	getFilteredProducts( options )
		.then( ( products ) => {
			if ( !products ) {
				return response.status( 200 ).send( [ ] );
			}
			
			console.log( products );
			
			response.status( 200 ).send( products );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Búsqueda de varios productos por identificador ]
* ================================================================================= */

server.post( '/some', ( request, response, next ) => {
	const { ids } = request.body;
	
	if ( !ids || !Array.isArray( ids ) || ids.some( id => isNaN( id ) ) ) {
		return response.status( 400 ).send( 'INVALID_PRODUCTS_ARRAY' );
	}
	
	Product.findAll( {
			where: {
				id: {
					[ Op.in ]: ids
				}
			},
			include: [
				{
					model: Category,
					attributes: [ 'id' ],
					through: {
						attributes: [ ]
					}
				},
				{
					model: Media
				}
			]
		} )
		.then( ( products ) => {
			if ( !products ) {
				return response.status( 404 ).send( 'EMPTY_PRODUCTS_ARRAY' );
			}
			
			response.status( 200 ).send( products );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Búsqueda de un producto por identificador ]
* ================================================================================= */

server.get( '/:id', ( request, response, next ) => {
	const { id } = request.params;
	
	Product.findByPk( id, {
			include: [
				{
					model: Category,
					attributes: [ 'id' ],
					through: {
						attributes: [ ]
					}
				},
				{
					model: Media
				}
			]
		} )
		.then( ( product ) => {
			if ( !product ) {
				return response.status( 404 ).send( 'PRODUCT_NOT_FOUND' );
			}
			
			response.status( 200 ).send( product );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Creación de un producto ]
* ================================================================================= */

server.post( '/', hasAccessLevel( ), ( request, response, next ) => {
	const { name, description, price, developer, publisher, publishDate } = request.body;
	
	let product;
	
	Product.create( {
			name,
			description,
			price,
			developer,
			publisher,
			publishDate
		} )
		.then( ( data ) => {
			if ( !data ) {
				response.status( 409 ).send( 'PRODUCT_NOT_CREATED' );
				
				return null;
			}
			
			product = data;
			
			const { keys } = request.body;
			
			if ( !Array.isArray( keys ) || ( keys.length === 0 ) ) {
				return [ ];
			}
			
			return Promise.map( keys, ( key ) => {
				return ProductKey.create( {
					key
				} );
			} );
		} )
		.then( ( keys ) => {
			if ( !keys ) {
				return null;
			}
			
			const promises = [ ];
			const { categories, media } = request.body;
			
			Array.isArray( categories ) && ( categories.length > 0 ) && promises.push( product.setCategories( categories ) );
			Array.isArray( media ) && ( media.length > 0 ) && promises.push( product.setMedia( media ) );
			Array.isArray( keys ) && ( keys.length > 0 ) && promises.push( product.setKeys( keys ) );
			
			if ( promises.length === 0 ) {
				return true;
			}
			
			return Promise.all( promises );
		} )
		.then( ( data ) => {
			if ( data ) {
				response.status( 201 ).send( product );
			}
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Modificación de un producto ]
* ================================================================================= */

server.put( '/', hasAccessLevel( ), ( request, response, next ) => {
	const { id } = request.params;
	const { name, description, price, developer, publisher, publishDate } = request.body;
	
	let product;
	
	Product.findByPk( id )
		.then( ( data ) => {
			if ( !data ) {
				response.status( 404 ).send( 'PRODUCT_NOT_FOUND' );
				
				return null;
			}
			
			product = data;
			
			return product.update( {
				name,
				description,
				price,
				developer,
				publisher,
				publishDate
			} );
		} )
		.then( ( data ) => {
			if ( !data ) {
				response.status( 409 ).send( 'PRODUCT_NOT_UPDATED' );
				
				return null;
			}
			
			const { keys } = request.body;
			
			if ( !Array.isArray( keys ) || ( keys.length === 0 ) ) {
				return [ ];
			}
			
			return Promise.map( keys, ( key ) => {
				return ProductKey.findOrCreate( {
					where: { key }
				} );
			} );
		} )
		.then( ( keys ) => {
			if ( !keys ) {
				return null;
			}
			
			if ( keys.some( ( [ created, key ] ) => !created && ( !key.available || ( key.productId !== product.id ) ) ) ) {
				response.status( 409 ).send( 'INVALID_KEYS' );
				
				return null;
			}
			
			const promises = [ ];
			const { categories, media } = request.body;
			
			Array.isArray( categories ) && ( categories.length > 0 ) && promises.push( product.setCategories( categories ) );
			Array.isArray( media ) && ( media.length > 0 ) && promises.push( product.setMedia( media ) );
			Array.isArray( keys ) && ( keys.length > 0 ) && promises.push( product.setKeys( keys.map( ( [ created, key ] ) => key ) ) );
			
			if ( promises.length === 0 ) {
				return true;
			}
			
			return Promise.all( promises );
		} )
		.then( ( data ) => {
			if ( data ) {
				response.status( 201 ).send( product );
			}
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Eliminación de un producto ]
* ================================================================================= */

server.delete( '/:id', hasAccessLevel( ), ( request, response, next ) => {
	let { id } = request.params;
	
	Product.findByPk( id )
		.then( ( product ) => {
			if ( !product ) {
				return response.status( 404 ).send( 'PRODUCT_NOT_FOUND' );
			}
			
			product.destroy( )
				.then( ( ) => {
					response.sendStatus( 204 );
				} );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Creación de una review ]
* ================================================================================= */

server.post( '/:productId/review/:userId', isAuthenticated, ( request, response, next ) => {
	const { productId, userId } = request.params;
	const { qualification, description } = request.body;
	
	Order.count( {
			where: {
				userId
			},
			include: {
				model: Product,
				required: true,
				where: {
					id: productId
				}
			}
		} )
		.then( ( order ) => {
			if ( !order ) {
				response.status( 404 ).send( 'REVIEW_PRODUCT_NEVER_BOUGHT' );
				
				return null;
			}
			
			return Review.findOrCreate( {
				where: {
					productId,
					userId
				},
				defaults: {
					qualification,
					description
				}
			} );
		} )
		.then( ( data ) => {
			if ( data === null ) {
				return;
			}
			
			const [ review, created ] = data;
			
			if ( !created ) {
				return response.status( 409 ).send( 'REVIEW_ALREADY_SUBMITTED' );
			}
			
			response.status( 201 ).send( review );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Modificación de una review ]
* ================================================================================= */

server.put( '/:productId/review/:userId', isAuthenticated, ( request, response, next ) => {
	const { productId, userId } = request.params;
	const { qualification, description } = request.body;
	
	Review.findOne( {
			where: {
				productId,
				userId
			}
		} )
		.then( ( review ) => {
			if ( !review ) {
				response.status( 404 ).send( 'REVIEW_NEVER_SUBMITTED' );
				
				return null;
			} 
		
			return review.update( {
				qualification,
				description
			} );
		} )
		.then( ( data ) => {
			if ( data === null ) {
				return;
			}
			
			response.status( 200 ).send( data );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Eliminación de una review ]
* ================================================================================= */

server.delete( '/:productId/review/:userId', isAuthenticated, ( request, response, next ) => {
	const { productId, userId } = request.params;
	
	Review.findOne( {
			where: {
				productId,
				userId
			}
		} )
		.then( ( review ) => {
			if ( !review ) {
				return response.status( 404 ).send( 'REVIEW_NEVER_SUBMITTED' );
			}
			
			review.destroy( )
				.then( ( ) => {
					response.sendStatus( 204 );
				} );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Obtención de la review de un producto por un usuario especifico ]
* ================================================================================= */

server.get( '/:id/review/:userId', ( request, response, next ) => {
	const { id, userId } = request.params;
	
	Review.findOne( {
			where: {
				productId: id,
				userId
			}
		} )
		.then( ( review ) => {
			if ( !review ) {
				return response.status( 404 ).send( 'REVIEW_NOT_FOUND' );
			}
			
			return response.status( 200 ).send( review );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Obtención de todas las review de un producto ]
* ================================================================================= */

server.get( '/:productId/review', ( request, response, next ) => {
	const { productId } = request.params;
	
	Review.findAll( {
			where: {
				productId
			}
		} )
		.then( ( reviews ) => {
			if ( !reviews ) {
				return response.status( 404 ).send( 'REVIEWS_NOT_FOUND' );
			}
			
			response.status( 200 ).send( reviews );
		} )
		.catch( ( error ) => {
			next( error );
		} );
} );

/* =================================================================================
* 		[ Exportamos nuestras rutas ]
* ================================================================================= */

module.exports = server;