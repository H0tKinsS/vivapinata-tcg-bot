module.exports = async () => {
  const elements = [0, 1, 2, 3, 4];
  const weights = [2, 6, 10, 6, 2];
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue < cumulativeWeight) {
      return elements[i];
    }
  }
}