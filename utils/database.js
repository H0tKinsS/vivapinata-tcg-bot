
const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'user', 'password', {
  dialect: 'sqlite',
  host: 'localhost',
  storage: 'database.sqlite',
  logging: false
})

const Users = require('../models/users.js')(sequelize, Sequelize.DataTypes);
const Guilds = require('../models/guild.js')(sequelize, Sequelize.DataTypes);
const Cards = require('../models/cards.js')(sequelize, Sequelize.DataTypes);
const Pinatas = require('../models/pinatas.js')(sequelize, Sequelize.DataTypes);
const Items = require('../models/items.js')(sequelize, Sequelize.DataTypes);
const AllItems = require('../models/allitems.js')(sequelize, Sequelize.DataTypes);
const Gardens = require('../models/gardens.js')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(Users.prototype, 'removeCard', {
  value: async (userId, sortCriteria, sortOrder) => {
    return await Cards.findOne({ where: { card_owner: userId }, order: [[sortCriteria, sortOrder]] }).then(card => card.update({ card_owner: null}))
  },
});
Reflect.defineProperty(Users.prototype, 'getCards', {
  value: async (userId, sortCriteria, sortOrder) => {
    return await Cards.findAll({ where: { card_owner: userId }, order: [[sortCriteria, sortOrder]] })
  },
});
Reflect.defineProperty(Users.prototype, 'getItems', {
  value: async (userId, sortCriteria, sortOrder) => {
    return await Items.findAll({ where: { user_id: userId }, order: [[sortCriteria, sortOrder]] })
  },
});

Reflect.defineProperty(Users.prototype, 'addCard', {
  value: async (serverId, userId, card) => {
    const dbCard = await Cards.findOne({ where: { card_id: card.identifier } });

    if (dbCard) {
      return await dbCard.update({ card_owner: userId})
    }
    try {
      return await Cards.create({
        card_id: card.identifier,
        card_name: card.name,
        card_owner: userId,
        card_ddate: card.currentDate,
        card_condition: card.condition,
        card_number: card.number,
        card_level: card.lvl,
        card_first_owner: card.first_owner,
        card_grabber: userId,
        card_dropper: userId,
        card_drop_condition: card.condition,
        card_drop_server: serverId,
      }).catch( err => console.log(err))
    } catch (err) {
      console.log(err);
    }
  },
});

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async (userId, item, amount) => {
		const userItem = await Items.findOne({
			where: { user_id: userId, item_id: item },
		});
		if (userItem) {
			userItem.item_amount += amount;
			return userItem.save();
		}

		return Items.create({ user_id: userId, item_id: item, item_amount: amount });
	},
});

module.exports = {
  Users,
  Guilds,
  Cards,
  Pinatas,
  Items,
  AllItems,
  Gardens
}