require( 'dotenv' ).config( );

const { Sequelize } = require( 'sequelize' );
const Promise = require( 'bluebird' );

const fs = require( 'fs' );
const path = require( 'path' );
const basename = path.basename( __filename );

/* =================================================================================
* 		[ Creamos la conexión con la base de datos ]
* ================================================================================= */

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize( `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`, {
	logging: false,
	native: false
} );

/* =================================================================================
* 		[ Leemos todos los modelos definidos, capitalizamos sus
*		   nombres y los agregamos a los modelos de Sequelize ]    
* ================================================================================= */

const modelDefiners = [ ];

fs.readdirSync( path.join( __dirname, '/models' ) )
	.filter( ( file ) => ( file.indexOf( '.' ) !== 0 ) && ( file !== basename ) && ( file.slice( -3 ) === '.js' ) )
	.forEach( ( file ) => {
		modelDefiners.push( require( path.join( __dirname, '/models', file ) ) );
	} );

modelDefiners.forEach( model => model( sequelize ) );

let entries = Object.entries( sequelize.models );
let capsEntries = entries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase( ) + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );

sequelize.models = Object.fromEntries( capsEntries );

/* =================================================================================
* 		[ Aplicamos destructuring para obtener los modelos
*		      y creamos las relaciones entre estos ]    
* ================================================================================= */

const { Product, Category, Media, User, Order, Review, Key, Offer, ResetToken, ProductCategory, OrderProduct, OfferProduct } = sequelize.models;

Product.hasMany( Media );
Media.belongsTo( Product );

User.hasMany( Order );
Order.belongsTo( User );

User.hasMany( ResetToken );
ResetToken.belongsTo( User );

Product.hasMany( Key );
Key.belongsTo( Product );

Order.hasMany( Key );
Key.belongsTo( Order );

Product.belongsToMany( Category, { through: ProductCategory } );
Category.belongsToMany( Product, { through: ProductCategory } );

Order.belongsToMany( Product, { through: OrderProduct } );
Product.belongsToMany( Order, { through: OrderProduct } );

User.belongsToMany( Product, { through: Review } );
Product.belongsToMany( User, { through: Review } );

Offer.belongsToMany( Product, { through: OfferProduct } );
Product.belongsToMany( Offer, { through: OfferProduct } );

/* =================================================================================
* 		[ Creamos un callback para la inserción de datos de prueba luego 
*			    de que Sequelize haya terminado de sincronizar ]    
* ================================================================================= */

( function( ) { 
	if ( process.env.NODE_ENV && ( process.env.NODE_ENV !== 'development' ) ) {
		return;
	}
	
	sequelize.afterBulkSync( ( ) => {
		const mockData = require( '../.mockdata' );
		const models = Object.keys( mockData );
		
		Promise.each( models, ( model ) => {
				return sequelize.models[ model ].bulkCreate( mockData[ model ], {
					individualHooks: true
				} );
			} )
			.then( ( ) => {
				console.log( 'Mock data successfully loaded' );
			} );
	} );
} )( );

/* =================================================================================
* 		[ Exportamos los modelos y la conexión ]    
* ================================================================================= */

module.exports = {
	...sequelize.models,
	conn: sequelize
};
