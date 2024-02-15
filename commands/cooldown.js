const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('cooldown')
        .setDescription('Sprawdz cooldown'),
    async execute(interaction) {

        const grabCooldown = await require('../functions/user/getGrabCooldown')(interaction.user.id);
        const dropCooldown = await require('../functions/user/getDropCooldown')(interaction.user.id);
        const embed = await require('../functions/embed/getEmbedCooldown.js')(grabCooldown, dropCooldown);

        interaction.reply({ embeds: [embed] });
        
    },
};
