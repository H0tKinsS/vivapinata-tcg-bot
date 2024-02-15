const { Collection } = require('discord.js');
const { Users } = require('../utils/database.js');
module.exports = async (userId, card) => {
  try {
    const [user, created] = await Users.findOrCreate({
      where: {
        user_id: userId
      }
    })
    await user.update({user_last_grab: new Date().toISOString(), user_last_grab_card_id: card.card_id});
    return await card.update({
      card_owner: userId,
      card_grabber: userId,
    })
  } catch (error) {
    console.error('Error in addCard:', error.message);
    return { success: false, message: 'Failed to add card.' };
  }
}
