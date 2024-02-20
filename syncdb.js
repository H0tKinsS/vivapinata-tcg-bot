const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});


require('./models/users.js')(sequelize, Sequelize.DataTypes);
require('./models/cards.js')(sequelize, Sequelize.DataTypes);
require('./models/items.js')(sequelize, Sequelize.DataTypes);
require('./models/gardens.js')(sequelize, Sequelize.DataTypes);
const Pinatas = require('./models/pinatas.js')(sequelize, Sequelize.DataTypes);
const AllItems = require('./models/allitems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const pinatas = require('./pinatas.js');
	const pinataPromises = pinatas.map(card => {
			return Pinatas.upsert({
					name: card.name,
					lvl: card.lvl,
					weight: card.weight,
					frame: card.frame,
					description: card.description,
					image_url: card.image_url,
			});
	});
	const items = require('./items.js');
	const itemPromises = items.map(item => {
		return AllItems.upsert({
			  item_id: item.id,
        item_description: item.description,
        item_name: item.name,
        item_emoji: item.emoji,
        item_category: item.category
		})
	})
	await Promise.all(itemPromises);
	await Promise.all(pinataPromises);
	console.log('Database synced');
	await sequelize.close();
}).catch(console.error);
