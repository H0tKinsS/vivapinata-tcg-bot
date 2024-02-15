const {Users} = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = async (userId) => {
  const [user, created] = await Users.findOrCreate({
    where: {
      user_id: userId
    }
  }); 
  if (user) {
    return user.user_last_grab_card_id ?? null;
  }
}
