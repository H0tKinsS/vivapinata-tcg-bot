
const { Pinatas } = require('../../utils/database.js');

module.exports = async (name) => {
	try {
		
		const pinata = await Pinatas.findOne({where: {name: name}});
	  
	  if (pinata) {
		return pinata;
	  } else {
		throw new Error(`Card not found: ${name}`);
	  }
	} catch (error) {
	  throw new Error(`Error while retrieving card: ${error.message}`);
	}
}