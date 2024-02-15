const {Users} = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = async (userId) => {
  const [user, created] = await Users.findOrCreate({
    where: {
      user_id: userId
    }
  }); 
  if (created || user.user_last_drop === null) {
    return 0; 
  }const dropCooldown = config.cards.drop_cooldown;
  const lastdrop = new Date(user.user_last_drop);
  const now = new Date();
  const diff = (now - lastdrop) / 1000; // Difference in seconds
  
  // Convert dropCooldown from minutes to milliseconds
  const cooldownMillis = dropCooldown * 60 * 1000; // dropCooldown in milliseconds
  
  // Calculate remaining cooldown time in milliseconds
  const remainingCooldownMillis = Math.max(cooldownMillis - diff * 1000, 0);
  
  // Convert remaining cooldown time from milliseconds to minutes
  const remainingCooldownMinutes = Math.ceil(remainingCooldownMillis / (1000 * 60));
  
  return remainingCooldownMinutes > 0 ? `${remainingCooldownMinutes}m` : 'dostępne';
  
}
