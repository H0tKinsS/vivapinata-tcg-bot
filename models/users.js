module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
		},
		user_last_drop: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		user_last_grab: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		user_last_grab_card_id: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	}, {
		timestamps: false,
	});
}