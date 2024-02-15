module.exports = (sequelize, DataTypes) => {
	return sequelize.define('pinatas', {
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		lvl: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		weight: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		frame: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		image_url: {
			type: DataTypes.TEXT,
			allowNull: false
		},
	}, {
		timestamps: false,
	});
}