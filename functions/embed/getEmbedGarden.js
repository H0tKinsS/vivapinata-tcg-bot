const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (garden) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Wyświetlanie ogrodu')
  .setDescription(`Tło: \`${garden.background || 'brak'}\`\nWłaściciel: <@${garden.user_id}>`)
  .setImage('attachment://image.png')
}