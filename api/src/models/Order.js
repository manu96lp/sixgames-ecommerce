const { DataTypes } = require( 'sequelize' );

const orderStatuses = [
	'cart',
	'created',
	'processing',
	'completed',
	'canceled'
];

function validateUpdate( order, options )
{
	const [ status ] = options.fields;
	
	if ( !status ) {
		return;
	}
	
	const oldStatus = orderStatuses.findIndex( ( e ) => order._previousDataValues.status === e );
	const newStatus = orderStatuses.findIndex( ( e ) => order.dataValues.status === e );
	
	if ( ( newStatus < 0 ) || ( newStatus < oldStatus ) || ( ( oldStatus === 0 ) && ( newStatus > 1 ) ) || ( ( oldStatus === 1 ) && ( newStatus === 3 ) ) )
	{
		return Promise.reject( new Error( 'INVALID_STATUS_CHANGE' ) );
	}
	
	if ( newStatus !== 0 )
	{
		return new Promise( ( resolve, reject ) => {
			order.getProducts( ).then( ( products ) => {
				if ( !products || ( products.length === 0 ) ) {
					reject( new Error( 'CART_IS_EMPTY' ) );
				}
				
				products.forEach( ( p ) => {
					if ( p.OrderProduct.quantity > p.stock ) {
						reject( new Error( 'STOCK_HAS_CHANGED' ) );
					}
				} );
				
				resolve( );
			} )
		} );
	}
	
	return Promise.resolve( );
}

module.exports = ( sequelize ) => {
	sequelize.define( 'order', {
		status: {
			type: DataTypes.ENUM,
			values: orderStatuses,
			allowNull: false
		}
	}, {
		hooks: {
			beforeUpdate: validateUpdate
		}
	} );
};