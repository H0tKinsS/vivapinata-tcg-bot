const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Pinatas = require('./models/pinatas.js')(sequelize, Sequelize.DataTypes);

sequelize.sync().then(async () => {
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
	await Promise.all(pinataPromises);
	console.log('All Pinatas uploaded successfully');
	await sequelize.close();
}).catch(console.error);
