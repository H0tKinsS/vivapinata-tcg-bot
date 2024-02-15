const { Cards} = require('../../utils/database.js');

async function getRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = async (length = 5) => {
    const getUniqueId = async (length) => {
        const identifier = await getRandomString(length);
        const count = await Cards.count({ where: { card_id: identifier } }); // Assuming you're using Sequelize
        if (count !== 0) {
            const newLength = length + 1;
            return getUniqueId(newLength);
        }
        return identifier;
    };

    return getUniqueId(length);
};
