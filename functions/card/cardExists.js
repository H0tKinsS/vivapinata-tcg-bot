const {Cards} = require('../../utils/database.js');

module.exports = async (cardId) => {
  return await Cards.findOne({
    where: {
      card_id: cardId
    }}).card_owner !== null ? true : false;
}