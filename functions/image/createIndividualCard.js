const config = require('../../config.json');
const { registerFont, createCanvas, loadImage } = require('canvas');

registerFont('./fonts/Funhouse.ttf', { family: 'funhouse' });
registerFont('./fonts/Cocogoose-Pro-Light-trial.ttf', { family: 'Cocogoose-Pro-Light-trial' });


const applyTextDraw = (canvas, text, maxWidth) => {
  const context = canvas.getContext('2d');
  let fontSize = 50;
  do {
    context.font = `bold ${fontSize -= 1}px Cocogoose-Pro-Light-trial`;
  } while (context.measureText(text).width > maxWidth);
  context.letterSpacing = 0;
  return context.font;
};

module.exports = async (card) => {
  const canvas = createCanvas(config.cards.width, config.cards.height);
  const context = canvas.getContext('2d');
  const backgroundImage = await loadImage(`${__dirname}/../../img/pinatas/${card.name}.png`);
  const frameImage = await loadImage(`${__dirname}/../../img/frames/${card.frame}`);
  const oldPaperTexture = await loadImage(`${__dirname}/../../img/old-paper-texture.png`);
  var newWidth = backgroundImage.width - 80; // Subtract 80 pixels in total (40 from each side)
  let condition = card.condition !== undefined ? card.condition.toString() : "4";
  context.drawImage(backgroundImage, 40, 0, backgroundImage.width - 80, backgroundImage.height, 40, 0, newWidth, backgroundImage.height);
  let opacity = 0;
  console.log(condition)
  switch(condition) {
    case "0":
      opacity = 0.7;
      break;
    case "1":
      opacity = 0.5;
      break;
    case "2":
      opacity = 0.4;
      break;
    case "3":
      opacity = 0.25;
      break;
    case "4":
      opacity = 0;
      break;
    default:
      opacity = 0.5;
      break;
  }
  console.log(opacity)
  context.globalAlpha = opacity;
  context.drawImage(oldPaperTexture, 0, 0, config.cards.width, config.cards.height);
  context.globalAlpha = 1;
  context.drawImage(frameImage, 0,0, config.cards.width, config.cards.height);
  const textStart = 100;
  const textEnd = config.cards.width - 100 
  const text = card.name;
  context.font = applyTextDraw(canvas, text, textEnd - textStart);
  const textWidth = context.measureText(text).width;
  let actualHeight = context.measureText('M').width;
  const centerX = (config.cards.width - textWidth) / 2; // Center horizontally

  const centerY = config.cards.height - config.cards.name_height + (actualHeight / 2) ; // Center vertically
  context.shadowColor = "black";
  context.shadowBlur = 8;
  context.fillStyle = '#ffffff'; // Change font color to black
  context.fillText(text, centerX, centerY);
  
  

  const level = card.lvl;
  context.shadowBlur = 4;
  context.font = `bold 35px funhouse`;
  const lvlWidth = context.measureText(level).width;
  const lvlHeight = context.measureText('M').width;
  const centerXLvl = (config.cards.width - lvlWidth) / 2;
  const centerYLvl = config.cards.level_height + (lvlHeight / 2)
  context.fillStyle = '#000000';
  context.fillText(level, centerXLvl, centerYLvl);
  context.fillStyle = '#fffffff';
  return canvas;
}