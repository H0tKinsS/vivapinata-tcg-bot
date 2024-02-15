const { EmbedBuilder } = require('discord.js');
const conditionToStars = require('../utils/conditionToStars.js');
/*
* {@param} {Card} card 
*/
module.exports = async (grab, drop) => {
  return new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Odnowienie')
  .setDescription(`Zebranie \*\*${grab}\*\*\nLosowanie \*\*${drop}\*\*`)
  .setImage('attachment://image.png')
}