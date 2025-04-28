function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, step = 0.01) {
  const range = Math.floor((max - min) / step);
  return parseFloat((min + step * randomInt(0, range)).toFixed(5));
}

module.exports = { randomInt, randomFloat };
