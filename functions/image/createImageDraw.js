const Cards = require('../../models/cards.js');
const config = require('../../config.json');
const { registerFont, createCanvas, loadImage } = require('canvas');
const createIndividualCard = require('./createIndividualCard.js');

registerFont('./fonts/Funhouse.ttf', { family: 'funhouse' });
registerFont('./fonts/Cocogoose-Pro-Light-trial.ttf', { family: 'Cocogoose-Pro-Light-trial' });


module.exports = async (cards) => {
  const cardWidthWithSpacing = config.cards.width;
  const canvasWidth = (cards.length * cardWidthWithSpacing);
  const canvas = createCanvas(canvasWidth, config.cards.height);
  const context = canvas.getContext('2d');
  
  for (let i = 0; i < cards.length; i++) {
      cards[i].condition = 4;
      const contentCanvas = await createIndividualCard(cards[i]);
      const xPos = (i * cardWidthWithSpacing);
      context.drawImage(contentCanvas, xPos, 0);
  }
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}