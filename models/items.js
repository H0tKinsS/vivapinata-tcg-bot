module.exports = (sequelize, DataTypes) => {
	return sequelize.define('items', {
		item_id: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		item_amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
}