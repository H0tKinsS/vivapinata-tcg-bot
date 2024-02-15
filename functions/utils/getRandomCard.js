const cards = require('../../pinatas');

module.exports = () => {
  const totalWeight = cards.reduce((sum, card) => sum + card.weight, 0);
  let randomWeight = Math.random() * totalWeight;
  let chosenCard = null;
  for (const card of cards) {
      randomWeight -= card.weight;
      if (randomWeight <= 0) {
          chosenCard = card;
          chosenCard.taken = false;
          break;
      }
  }
  return chosenCard;
}