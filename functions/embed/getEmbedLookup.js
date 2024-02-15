const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (card) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle(`Wyświetlanie karty`)
  .setDescription(`\*\*Nazwa: \*\*\`${card.name}\`\n\*\*Poziom: \*\*\`${card.lvl}\`\n`)
  .setImage('attachment://image.png')
  .setTimestamp()
}