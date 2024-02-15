const getCardFromName = require('../functions/utils/getCardFromName.js');
const createImage = require('../functions/image/createImage.js');
const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {Cards} = require('../utils/database.js');
const getEmbedView = require('../functions/embed/getEmbedView.js');
const getEmbedViewInfo = require('../functions/embed/getEmbedViewInfo.js');
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('view')
		.setDescription('Obejrzyj piniatę')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('Wpisz id piniaty')
				.setRequired(false)),
	async execute(interaction) {
		try {
			let cardId = interaction.options.getString('id') ?? await require('../functions/user/getLastGrab.js')(interaction.user.id) ?? null;

			if (!cardId) {
				return;
			}
      const dbcard = await Cards.findOne({where: {card_id: cardId}});

			if (!dbcard || !dbcard.card_owner || !dbcard.card_grabber) {
				return await interaction.reply({content: `Nie znaleziono piniaty`, ephemeral: true});
			} else {
				let card = await getCardFromName(dbcard.card_name);
        card.condition = dbcard.card_condition;
				const imageBuffer = await createImage(card);

				const row = new ActionRowBuilder();
				row.addComponents(
          new ButtonBuilder()
						.setCustomId('info')
						.setDisabled(false)
						.setLabel('Więcej')
						.setStyle(ButtonStyle.Primary)
				)
        const embed = await getEmbedView(dbcard);
				await interaction.deferReply()
				const msg = await interaction.editReply({
					embeds: [embed],
					components: [row],
					files: [{
						attachment: imageBuffer,
						name: 'image.png'
					}]})
				const collectorFilter = user => user.user.id === interaction.user.id;
				const collector = msg.createMessageComponentCollector({ filter: collectorFilter, time: 20000 })
				collector.on('collect', async i => {
					if (i.customId === 'info'){
						
						const backRow = new ActionRowBuilder();
						backRow.addComponents(
							new ButtonBuilder()
								.setCustomId('back')
								.setDisabled(false)
								.setLabel('Wróć')
								.setStyle(ButtonStyle.Primary)
						)
						InfoEmbed = await getEmbedViewInfo(dbcard);
						await i.update({
							embeds: [InfoEmbed],
							components: [backRow]
						})
					} else if (i.customId === 'back'){
						await i.update({
							embeds: [embed],
							components: [row],
							files: [{
								attachment: imageBuffer,
								name: 'image.png'}]
						})
					}
				})
			}
	  }  catch (error) {
      console.log(error);
    }
  }
};