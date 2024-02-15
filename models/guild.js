module.exports = (sequelize, DataTypes) => {
	return sequelize.define('servers', {
		guild_id: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
		},
		owner: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		draw_channel: {
			type: DataTypes.TEXT,
			allowNull: true
		},
	}, {
		timestamps: false,
	});
}