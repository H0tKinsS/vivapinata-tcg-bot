module.exports = async (condition) => {
  let starsString = '';
	for (let i = 1; i <= 4; i++) {
		starsString += i <= condition ? '★' : '☆';
	}
	return starsString;
}