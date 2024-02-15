const path = require('path');
const config = require('../../config.json');
const { registerFont, createCanvas, loadImage } = require('canvas');
const createIndividualCard = require('./createIndividualCard.js');

registerFont('./fonts/Funhouse.ttf', { family: 'funhouse' });
registerFont('./fonts/Cocogoose-Pro-Light-trial.ttf', { family: 'Cocogoose-Pro-Light-trial' });


module.exports = async (card) => {
  try {
    const canvas = createCanvas(config.cards.width, config.cards.height);
    const context = canvas.getContext('2d');
    
    const newCanvas = await createIndividualCard(card);
    context.drawImage(newCanvas, 0, 0)
    const buffer = canvas.toBuffer('image/png');
    return buffer;
  } catch (error) {
    console.log(error);
  }
}