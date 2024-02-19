const config = require('../../config.json');
const { registerFont, createCanvas, loadImage } = require('canvas');
const createIndividualCard = require('./createIndividualCard.js');
const {Cards} = require('../../utils/database.js')
const getCardFromName = require('../utils/getCardFromName.js');
registerFont('./fonts/Funhouse.ttf', { family: 'funhouse' });
registerFont('./fonts/Cocogoose-Pro-Light-trial.ttf', { family: 'Cocogoose-Pro-Light-trial' });


module.exports = async (slots) => {
  const cardWidthWithSpacing = config.garden.card_width;
  const canvasWidth = (config.garden.cards_per_row * cardWidthWithSpacing);
  const canvasHeight = (config.garden.card_height+20) * config.garden.rows;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext('2d');
  const dbcards = await Cards.findAll({ where: { card_id: slots.filter(slot => slot !== null) } });
  for (let i = 0; i < config.garden.rows; i++) {
    const yPos = i * (config.garden.card_height + 20);
    for (let j = 0; j < config.garden.cards_per_row; j++){
      const slot = i * config.garden.cards_per_row + j;
      if (slots[slot] !== null) {
        const dbcard = dbcards.find(dbcard => dbcard.card_id === slots[slot]);
        if (dbcard) {
          console.log(`Slot ${slot}: ${slots[slot]}`)
          let card = await getCardFromName(dbcard.card_name)
          card.condition = dbcard.card_condition;
          const contentCanvas = await createIndividualCard(card);
          const xPos = j * cardWidthWithSpacing;
          context.drawImage(contentCanvas, xPos, yPos, config.garden.card_width, config.garden.card_height);
        }
      }
    }
  }
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}