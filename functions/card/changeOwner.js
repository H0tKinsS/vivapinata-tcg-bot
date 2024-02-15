const {Cards} = require('../../utils/database.js');

module.exports = async (cardId, owner ,newOwner) => {
  return await Cards.findOne({
    where: {
      card_id: cardId
    }
  }).then(card => {
    if (card.card_owner === owner) {
      card.update({
        card_owner: newOwner
      })
    }
  }).catch(err => console.log(err));
}