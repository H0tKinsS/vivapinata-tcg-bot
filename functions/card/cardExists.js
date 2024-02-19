const {Cards} = require('../../utils/database.js');

module.exports = async (cardId) => {
  const card = await Cards.findOne({
    where: {
      card_id: cardId
    }})
  if (!card || !card.card_owner || !card.card_grabber) {
    return false;
  } else {
    return true
  }
}