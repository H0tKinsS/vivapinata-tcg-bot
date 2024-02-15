const {Users} = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = async (userId) => {
  const [user, created] = await Users.findOrCreate({
    where: {
      user_id: userId
    }
  }); 
  if (created || user.user_last_grab === null) {
    return 0; 
  }const grabCooldown = config.cards.grab_cooldown;
  const lastGrab = new Date(user.user_last_grab);
  const now = new Date();
  const diff = (now - lastGrab) / 1000; // Difference in seconds
  
  // Convert grabCooldown from minutes to milliseconds
  const cooldownMillis = grabCooldown * 60 * 1000; // grabCooldown in milliseconds
  
  // Calculate remaining cooldown time in milliseconds
  const remainingCooldownMillis = Math.max(cooldownMillis - diff * 1000, 0);
  
  // Convert remaining cooldown time from milliseconds to minutes
  const remainingCooldownMinutes = Math.ceil(remainingCooldownMillis / (1000 * 60));
  
  return remainingCooldownMinutes > 0 ? `${remainingCooldownMinutes}m` : 'dostępne';
  
}
