const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (card) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Przekazanie piniaty')
  .setDescription(`<@${card.card_owner}> chce przekazać ci piniatę\n\n\`${card.card_id}\` · \`#${card.card_number}\` · \`${await conditionToStars(card.card_condition)}\` · \`Lv. ${card.card_level}\` · ${card.card_name}\nZgadzasz się?`)
  .setImage('attachment://image.png')
}