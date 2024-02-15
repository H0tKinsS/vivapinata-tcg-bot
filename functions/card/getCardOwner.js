const {Cards} = require('../../utils/database.js');

module.exports = async (cardId) => {
  const card = await Cards.findOne({
    where: {
      card_id: cardId
    }
  })
  return card ? card.card_owner : null;
}