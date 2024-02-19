
const { Items, AllItems } = require('../../utils/database.js');

async function getItemFromId(id) {
	try {
		const item = await AllItems.findOne({where: {item_id: id}});
	  
		if (item) {
	  	return item.item_name;
		} else {
		throw new Error(`Card not found: ${name}`);
	  }
	} catch (error) {
	  throw new Error(`Error while retrieving card: ${error.message}`);
	}
}
async function getEmojiFromId(id) {
	try {
		const item = await AllItems.findOne({where: {item_id: id}});
		if (item) {
	  	return item.item_emoji;
		}
	} catch (error) {
	  throw new Error(`Error while retrieving card: ${error.message}`);
	}
}

module.exports = {
	getItemFromId,
	getEmojiFromId,
    // Add more utility functions as needed
};