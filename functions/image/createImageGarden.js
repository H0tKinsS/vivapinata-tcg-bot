const config = require('../../config.json');
const { registerFont, createCanvas, loadImage } = require('canvas');
const createIndividualCard = require('./createIndividualCard.js');
const {Cards, Gardens} = require('../../utils/database.js')
const getCardFromName = require('../utils/getCardFromName.js');
registerFont('./fonts/Funhouse.ttf', { family: 'funhouse' });
registerFont('./fonts/Cocogoose-Pro-Light-trial.ttf', { family: 'Cocogoose-Pro-Light-trial' });
registerFont('./fonts/GloriaHallelujah-Regular.ttf', { family: 'GloriaHallelujah-Regular' });


module.exports = async (cards, ownerId, background) => {
  console.log(cards)
  const cardWidthWithSpacing = config.garden.card_width;
  const canvasWidth = (config.garden.cards_per_row * cardWidthWithSpacing);
  const canvasHeight = ((config.garden.card_height) * config.garden.rows) + (20*config.garden.rows) + 20;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext('2d');
  if (background) {
    const backgroundImage = await loadImage(`${__dirname}/../../img/background/${background.replace(/ /g, "_")}.png`);
    context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
  }
  for (let i = 0; i < config.garden.rows; i++) {
    const yPos = i * (config.garden.card_height + 20) + 20;
    for (let j = 0; j < config.garden.cards_per_row; j++){
      const slot = i * config.garden.cards_per_row + j;
      if (cards.get(slot+1) !== null) {
        const card = cards.get(slot+1);
        if (!card || card.card_owner === null || card.card_owner !== ownerId) {
          await Gardens.findOne({ where: {user_id: ownerId}}).then(garden => garden.update({ [`slot_${slot+1}`]: null})).catch(err => console.log(err));
          continue;
        }
        console.log(`Slot ${slot+1}: ${cards.get(slot+1).card_id}, owner: ${card.card_owner}`);
        let pinata = await getCardFromName(card.card_name);
        pinata.condition = card.card_condition;
        const contentCanvas = await createIndividualCard(pinata);

        // Save the current state of the canvas context
        context.save();
      
        // Set shadow properties
        context.shadowColor = 'rgba(0, 0, 0, 0.8)'; // Shadow color
        context.shadowBlur = 10; // Blur level
        context.shadowOffsetX = 0; // Shadow offset in X
        context.shadowOffsetY = 0; // Shadow offset in Y
      
        const xPos = j * cardWidthWithSpacing;
        context.drawImage(contentCanvas, xPos, yPos, config.garden.card_width, config.garden.card_height);
      
        // Restore the canvas context to its original state
        context.restore();
      }
    }
  }
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}