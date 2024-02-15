const { Events } = require('discord.js');
const { Cards } = require('../utils/database.js');
module.exports = {
	name: Events.ClientReady,
	async execute(c) {
    const storedCards = await Cards.findAll();
    console.log(`${storedCards.length} cards stored in the database!`);
    console.log(`Ready! Logged in as ${c.user.tag}`);
    
  }
};
