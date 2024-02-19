const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const {Cards} = require('../utils/database.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Przenieś własność piniaty')
        .addUserOption(option => option.setName('gracz').setDescription('Gracz').setRequired(true))
        .addStringOption(option => option.setName('id').setDescription('ID piniaty').setRequired(false)),
    async execute(interaction) {
        if (interaction.options.getUser('gracz').bot) return;
        const cardId = interaction.options.getString('id') ?? await require('../functions/user/getLastGrab.js')(interaction.user.id) ?? null;

        if (!cardId) {
            return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
        }

        const card = await Cards.findOne({where: {card_id: cardId}})
        if (!card) {
            return;
        }
        if (await card.getOwner() !== interaction.user.id) {
            return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
        }
        const tempcard = await require('../functions/utils/getCardFromName')(card.card_name);
        tempcard.condition = card.card_condition;
        const image = await require('../functions/image/createImage')(tempcard);
        
        const embed = await require('../functions/embed/getEmbedGive')(card);

        const row = new ActionRowBuilder().addComponents()

        const accept = new ButtonBuilder().setCustomId(card.card_id).setStyle(ButtonStyle.Success).setLabel('Akceptuj')
        const confirmGive = new ButtonBuilder().setCustomId('confirm').setStyle(ButtonStyle.Danger).setLabel('Potwierdź przekazanie piniaty')
        row.addComponents(confirmGive)
        const msg = await interaction.reply({
            content:`<@${interaction.options.getUser('gracz').id}>`, 
            embeds: [embed], 
            files: [{
                attachment: image, 
                name: 'image.png' 
            }], 
            components: [row] 
        });
        const collector = msg.createMessageComponentCollector({time: 30000, filter: i => i.user.id === interaction.options.getUser('gracz').id || i.user.id === interaction.user.id})
        
        collector.on('collect', async i => {
            
            //Accept receiver
            if (i.customId === card.card_id) {
                if (i.user.id !== interaction.options.getUser('gracz').id) return;
                // await require('../functions/card/changeOwner')(cardId, interaction.user.id, interaction.options.getUser('gracz').id);
                await card.setOwner(interaction.options.getUser('gracz').id);
                const newEmbed = await require('../functions/embed/getEmbedGiveSuccess')(card);
                await i.update({embeds: [newEmbed], components: []});
            } 
            // Confirm owner
            else if (i.customId === 'confirm'){
                if (await card.getOwner() !== interaction.user.id) return;
                if (i.user.id !== interaction.user.id) return;
                const newRow = new ActionRowBuilder().addComponents(accept);
                await i.update({embeds: [embed], components: [newRow]});
            }
        })
    },
};
