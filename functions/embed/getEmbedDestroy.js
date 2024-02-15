const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (card, cost) => {
  return new EmbedBuilder()
  .setColor(0xED4245)
  .setTitle(`Niszczenie piniaty`)
  .setDescription(`\`${card.card_id}\` · \`#${card.card_number}\` · \`${await conditionToStars(card.card_condition)}\` · \`Lv. ${card.card_level}\``)
  .addFields(
    {
      name: card.card_name,
      value: `Czy na pewno chcesz zniszczyć tę piniatę za \`${cost}🏵️\`?`,
      inline: true
    }
  )
  .setImage('attachment://image.png')
  .setTimestamp()
}