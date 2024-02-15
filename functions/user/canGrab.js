const {Users} = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = async (userId) => {
  const [user, created] = await Users.findOrCreate({
    where: {
      user_id: userId
    }
  }); 
  if (created || user.user_last_grab === null) {
    console.log('Empty last_grab, can grab');
    return true; 
  }
  const lastGrab = new Date(user.user_last_grab);
  const now = new Date();
  const diff = now - lastGrab;
  return (diff > 1000 * 60 * config.cards.grab_cooldown)
};

