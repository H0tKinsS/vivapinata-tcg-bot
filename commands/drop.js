
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType, Collection  } = require('discord.js');
const config = require('../config.json');
const {Cards, Users} = require('../utils/database.js');
const setFirstOwner = require('../functions/setFirstOwner.js');
const getRandomCard = require('../functions/utils/getRandomCard.js');
const createImageDraw = require('../functions/image/createImageDraw.js');
const conditionToStars = require('../functions/utils/conditionToStars.js');
const createCard = require('../functions/createCard.js');
const getCardFromName = require('../functions/utils/getCardFromName.js');
const getCardFromId = require('../functions/utils/getCardFromId.js');
const getRandomCondition = require('../functions/utils/getRandomCondition.js');
const getUniqueId = require('../functions/utils/getUniqueId.js');
const getUser = require('../functions/user/getUser.js');
const setDropCooldown = require('../functions/user/setDropCooldown.js');
module.exports = {
  cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('draw')
		.setDescription('Wylosuj piniatę'),
	async execute(interaction) {
		const dropper = await getUser(interaction.user.id);
		if (!dropper.canDrop()) {
			return await interaction.reply({ content: 'Nie możesz jeszcze wylosować piniaty!', ephemeral: true });
		}
		await setDropCooldown(interaction.user.id)
		const currentDate = new Date();
		const now = Date.now();
		let randomCards = [];
		let row = new ActionRowBuilder();
		const cardsToGrab = new Collection();
		for (let i = 0; i < config.cards.default_draw_amount; i ++) {
			randomCards[i] = await getCardFromName(getRandomCard().name);
			const {count, rows} = await Cards.findAndCountAll({where: {card_name: randomCards[i].name}});
			randomCards[i].number = count+1;
			randomCards[i].currentDate = currentDate.toISOString();
			randomCards[i].dropper = dropper.user_id;
			randomCards[i].condition = await getRandomCondition();
			randomCards[i].identifier = await getUniqueId();
			const createdCard = await createCard(interaction, randomCards[i])
			if (createdCard) {
				const btn = new ButtonBuilder()
					.setCustomId(`${createdCard.card_id}`)
					.setLabel(`${createdCard.card_name}`)
					.setStyle(ButtonStyle.Success);
				row.addComponents(btn);
				cardsToGrab.set(createdCard.card_id, true);
			}
		}
		const imageBuffer = await createImageDraw(randomCards);
		const messageContent = `<@${dropper.user_id}> losuje karty`;
		await interaction.deferReply();
		const response = await interaction.editReply({
			content: messageContent,
			components: [row],
			files: [imageBuffer]}
		)
		let others_can_grab = false;
		if (config.cards.others_can_grab) {
			setTimeout(() => {
				others_can_grab = true;
			}, config.cards.others_can_grab_after * 1000);
		}
		const collector = response.createMessageComponentCollector({time: 60_000 });
		collector.on('collect', async i => {
			const grabber = await getUser(i.user.id);
			const can_grab = await grabber.canGrab();
			if (cardsToGrab.get(i.customId) === false) {
				return;
			}
			if (!others_can_grab && grabber.user_id !== dropper.user_id) {
				if (config.cards.others_can_grab) {
					return await i.reply({
						content: `<@${grabber.user_id}> nie możesz zebrać piniaty przed dropiącym!`,
						ephemeral: true
					});
				} else {
					return;
				}
			}
			if (!can_grab) {
				return await i.reply({
					content: `<@${grabber.user_id}> nie możesz jeszcze zebrać piniaty!`,
					ephemeral: true
				});
			}
			if (dropper.user_id === dropper.user_id) {
				if (config.cards.others_can_grab) others_can_grab = true;
			}
			cardsToGrab.set(i.customId, false);
			const card = await getCardFromId(i.customId)
			try {
				await setFirstOwner(grabber.user_id, card);
				await i.reply(`<@${grabber.user_id}> wybrał/a piniate **${card.card_name}** \`${card.card_id}\` · \`${await conditionToStars(card.card_condition)}\`!`);;
			} catch (err) {
				console.log(err);
			}
		})
		collector.on('end', async i => {
			await response.edit({content: `Czas na wybranie piniaty upłynął.`});
		})
	}	
};