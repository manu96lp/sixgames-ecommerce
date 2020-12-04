const { DataTypes } = require( 'sequelize' );

module.exports = ( sequelize ) => {
	sequelize.define ( 'OrderProduct', {
		orderId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Order',
				key: 'id'
			}
		},
		productId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Product',
				key: 'id'
			}
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: { isFloat: true }
		}
	}, {
		timestamps: false,
		tableName: 'order_product'
	} );
};