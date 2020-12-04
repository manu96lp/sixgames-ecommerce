const { DataTypes } = require( 'sequelize' );

module.exports = ( sequelize ) => {
    sequelize.define( 'offer', {
        alias: {
            type: DataTypes.STRING,
			allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
			allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
			allowNull: false,
        },
        endDate: {
            type: DataTypes.STRING,
			allowNull: false,
        }
    } );
};