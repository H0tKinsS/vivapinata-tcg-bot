module.exports = (sequelize, DataTypes) => {
	return sequelize.define('allitems', {
		item_id: {
			type: DataTypes.TEXT,
			allowNull: false,
      primaryKey: true,
		},
		item_description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		item_emoji: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		item_name: {
			type: DataTypes.TEXT,
      allowNull: false
		},
		item_category: {
			type: DataTypes.TEXT,
      allowNull: false
		}
	}, {
		timestamps: false,
	});
}