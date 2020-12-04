const { DataTypes } = require('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( 'OfferProduct', {
        offerId: {
            type: DataTypes.INTEGER,
			references: {
				model: 'Offer',
				key: 'id'
			}
        },
		productId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Product',
				key: 'id'
			}
		}
    }, {
		tableName: 'offer_product'
	} );
};