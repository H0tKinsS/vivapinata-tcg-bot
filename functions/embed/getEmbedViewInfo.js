const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (card) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle(`Informacje o piniacie`)
  .setDescription(`
  \`${card.card_id}\` · \`#${card.card_number}\` · \`${await conditionToStars(card.card_condition)}\` · \`Lv. ${card.card_level}\` · ${card.card_name}
  
  Wydropiono <t:${Math.floor(new Date(card.card_ddate) / 1000)}>
  na serwerze \`\`${card.card_drop_server}\`\`\n
  Właściciel <@${card.card_owner}>
  Wydropił <@${card.card_dropper}>
  Zebrał <@${card.card_grabber}>

  Oryginalna jakość \*\*${await require('../utils/conditionToString.js')(card.card_drop_condition)}\*\*
  `)
	.setThumbnail('attachment://image.png')
}