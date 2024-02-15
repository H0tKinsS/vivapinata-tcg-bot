module.exports = async (condition) => {
  return condition == 0 ? 'zniszczona' : condition == 1 ? 'używana' : condition == 2 ? 'przeciętna' : condition == 3 ? 'dobra' : condition == 4 ? 'doskonała' : 'brak';
}