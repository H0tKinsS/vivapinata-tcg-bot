const config = require('../config.json');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
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
Reflect.defineProperty(Gardens.prototype, 'getBackgroundId', {
  value: async function() {
    return await this.background;
  }
});
Reflect.defineProperty(Gardens.prototype, 'getCards', {
  value: async function() {
    const slots = new Map();
    const cards = new Map();
    for (let i = 1; i <= config.garden.rows * config.garden.cards_per_row; i++) {
      const slot = `slot_${i}`;
      slots.set(i, this[slot]);
    }
    const cardIds = Array.from(slots.values()).filter(slot => slot !== null);

    const dbcards = await Cards.findAll({ where: { card_id: {[Op.in]: cardIds}, card_owner: this.user_id}});
    dbcards.forEach(card => {
      slots.forEach((cardId, slot) => { // Corrected parameter order
        if (cardId === card.card_id) {
          if (card.card_owner !== this.user_id) {
            this.update({ [`slot_${slot}`]: null});
          } else {
            cards.set(slot, card);
          }
        }
      });
    });
    console.log(JSON.stringify(cards));
    return cards;
  },
});

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
Reflect.defineProperty(Users.prototype, 'getGarden', {
  value: async function() {
    const userId = this.user_id; // Assuming user_id is a property of Users instances
    const [garden, created] = await Gardens.findOrCreate({ where: { user_id: userId }});
    return garden;
  },
});
Reflect.defineProperty(Users.prototype, 'hasItem', {
  value: async function(item) {
    return await Items.findOne({ where: { user_id: this.user_id, item_id: item }}) !== null;
  },
});
Reflect.defineProperty(Users.prototype, 'getItem', {
  value: async function(item) {
    return await Items.findOne({ where: { user_id: this.user_id, item_id: item }});
  },
});
Reflect.defineProperty(Users.prototype, 'getItems', {
  value: async function(sortCriteria, sortOrder) {
    return await Items.findAll({ where: { user_id: this.user_id }, order: [[sortCriteria, sortOrder]] })
  },
});
Reflect.defineProperty(Users.prototype, 'canDrop', {
  value: async function() {
    if (this.user_last_drop === null || this.user_id === '303932338436440066') {
      return true; 
    }
    const lastDrop = new Date(this.user_last_drop);
    const now = new Date();
    const diff = now - lastDrop;
    return (diff > 1000 * 60 * config.cards.drop_cooldown)
  },
});
Reflect.defineProperty(Users.prototype, 'canGrab', {
  value: async function() {
    if (this.user_last_grab === null || this.user_id === '303932338436440066') {
      return true; 
    }
    const lastGrab = new Date(this.user_last_grab);
    const now = new Date();
    const diff = now - lastGrab;
    return (diff > 1000 * 60 * config.cards.grab_cooldown)
  }
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
Reflect.defineProperty(Users.prototype, 'removeItem', {
	value: async function(item, amount) {
    try {
      const userItem = await Items.findOne({
        where: { user_id: this.user_id, item_id: item },
      });
      if (userItem) {
        if (userItem.item_amount >= amount) {
          userItem.item_amount -= amount;
        }
        await userItem.save();
        return true
      }
      return false;
    } catch (err) {
      console.log(err);
      return false
    }
	},
});
Reflect.defineProperty(Cards.prototype, 'setOwner', {
  value: async function(userId) {
    return await this.update({ card_owner: userId});
  },
});
Reflect.defineProperty(Cards.prototype, 'setGrabber', {
  value: async function(userId) {
    return await this.update({ card_grabber: userId});
  },
});
Reflect.defineProperty(Cards.prototype, 'setDropper', {
  value: async function(userId) {
    return await this.update({ card_dropper: userId});
  },
});
Reflect.defineProperty(Cards.prototype, 'getOwner', {
  value: async function() {
    return this.card_owner ?? null;
  },
});

Reflect.defineProperty(Cards.prototype, 'getGrabber', {
  value: async function() {
    return await this.card_dropper;
  },
});
Reflect.defineProperty(Cards.prototype, 'getDropper', {
  value: async function() {
    return await this.card_grabber;
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