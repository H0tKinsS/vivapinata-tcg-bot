module.exports = (sequelize, DataTypes) => {
	return sequelize.define('cards', {
		card_id: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
		},
		card_name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		card_owner: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		card_ddate: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		card_condition: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		card_number: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		card_level: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		card_grabber: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		card_dropper: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		card_drop_server: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		card_drop_condition: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamps: false,
	});
}