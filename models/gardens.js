module.exports = (sequelize, DataTypes) => {
	return sequelize.define('gardens', {
		user_id: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
		},
		slot_1: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_2: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_3: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_4: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_5: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_6: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_7: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_8: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_9: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		slot_10: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		background: {
			type: DataTypes.TEXT,
			allowNull: true
		},
	}, {
		timestamps: false,
	});
}