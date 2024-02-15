const {Users} = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = async (userId) => {
  const [user, created] = await Users.findOrCreate({
    where: {
      user_id: userId
    }
  }); 
  if (created || user.user_last_drop === null) {
    console.log('Empty last_drop, can drop');
    return true; 
  }
  const lastDrop = new Date(user.user_last_drop);
  const now = new Date();
  const diff = now - lastDrop;
  return (diff > 1000 * 60 * config.cards.drop_cooldown)
};

