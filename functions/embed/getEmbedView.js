const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (card) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Informacje o piniacie')
  .setDescription(`Właściciel: <@${card.card_owner}>\n\n\`${card.card_id}\` · \`#${card.card_number}\` · \`${await conditionToStars(card.card_condition)}\` · \`Lv. ${card.card_level}\` · ${card.card_name}`)
  .setImage('attachment://image.png')
}