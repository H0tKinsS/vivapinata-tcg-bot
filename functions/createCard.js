const { Cards } = require('../utils/database.js');

module.exports = async (i, card) => {
  try {
    return await Cards.create({
      card_id: card.identifier,
      card_name: card.name,
      card_owner: null,
      card_ddate: card.currentDate,
      card_condition: card.condition,
      card_number: card.number,
      card_level: card.lvl,
      card_grabber: null,
      card_dropper: i.user.id,
      card_drop_condition: card.condition,
      card_drop_server: i.guild.id,
    }).catch( err => console.log(err))
  } catch (err) {
    console.error(err);
  }
}
