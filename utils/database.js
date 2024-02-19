
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
  value: async function() {
    return await Cards.findOne({ where: { card_owner: this.user_id }}).then(card => card.update({ card_owner: null}))
  },
});
Reflect.defineProperty(Users.prototype, 'getCards', {
  value: async function(sortCriteria, sortOrder) {
    const userId = this.user_id; // Assuming user_id is a property of Users instances
    return await Cards.findAll({ where: { card_owner: userId }, order: [[sortCriteria, sortOrder]] });
  },
});
Reflect.defineProperty(Users.prototype, 'getItems', {
  value: async function(sortCriteria, sortOrder) {
    return await Items.findAll({ where: { user_id: this.user_id }, order: [[sortCriteria, sortOrder]] })
  },
});

Reflect.defineProperty(Users.prototype, 'addCard', {
  value: async function(serverId, card) {
    const userId = this.user_id;
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
	value: async function(item, amount) {
		const userItem = await Items.findOne({
			where: { user_id: this.user_id, item_id: item },
		});
		if (userItem) {
			userItem.item_amount += amount;
			return userItem.save();
		}

		return Items.create({ user_id: this.user_id, item_id: item, item_amount: amount });
	},
});

Reflect.defineProperty(Cards.prototype, 'getOwner', {
  value: async function() {
    console.log(this.card_owner)
    return this.card_owner ?? null;
  },
});

Reflect.defineProperty(Cards.prototype, 'setOwner', {
  value: async function(userId) {
    console.log(this.card_owner)
    return await this.update({ card_owner: userId});
  },
});

Reflect.defineProperty(Cards.prototype, 'setOwner', {
  value: async function(userId) {
    console.log(this.card_owner)
    return await this.update({ card_owner: userId});
  },
});
Reflect.defineProperty(Cards.prototype, 'burn', {
  value: async function() {
    return await this.update({ card_owner: null});
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