
const { Cards } = require('../../utils/database.js');

module.exports = async (id) => {
	try {
		return await Cards.findOne({where: {card_id: id}});
	} catch (error) {
	  throw new Error(`Error while retrieving card: ${error.message}`);
	}
}

